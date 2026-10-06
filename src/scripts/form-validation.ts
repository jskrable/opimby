import { TURNSTILE_FIELD } from "../forms/common";
import { formatAsYouType, isValidPhone } from "../forms/phone";

type Control = HTMLInputElement | HTMLTextAreaElement;

const PENDING_MESSAGE = "Still checking that you're a person. Try again in a few seconds.";

// appendChild, not append: the global Workers types redefine Element.append.
export function enhanceForms() {
  document.querySelectorAll<HTMLFormElement>("form[data-validate]").forEach(enhance);
}

function enhance(form: HTMLFormElement) {
  form.noValidate = true;
  const summary = form.querySelector<HTMLElement>(".error-summary")!;
  const fields = [...form.querySelectorAll<HTMLElement>("[data-field]")];
  let submitted = false;

  if (!summary.hidden) summary.focus();

  form.addEventListener("submit", (event) => {
    submitted = true;
    const errors = fields.flatMap((field) => {
      const message = messageFor(field);
      showError(field, message);
      return message ? [{ field, message }] : [];
    });
    const token = form.querySelector<HTMLInputElement>(`[name="${TURNSTILE_FIELD}"]`)?.value;

    if (errors.length || !token) {
      event.preventDefault();
      showSummary(summary, errors, errors.length ? undefined : PENDING_MESSAGE);
    }
  });

  form.addEventListener("focusout", (event) => {
    const field = (event.target as Element).closest<HTMLElement>("[data-field]");
    if (field && submitted) showError(field, messageFor(field));
  });

  form.addEventListener("input", (event) => {
    if (event.target instanceof HTMLInputElement && event.target.dataset.format === "phone") formatPhone(event);
    const field = (event.target as Element).closest<HTMLElement>("[data-field]");
    if (field?.classList.contains("field--error")) showError(field, messageFor(field));
  });
}

// Only at the end and never on delete, so editing mid-number and backspacing work.
function formatPhone(event: Event) {
  const input = event.target as HTMLInputElement;
  const deleting = (event as InputEvent).inputType?.startsWith("delete");
  if (deleting || input.selectionStart !== input.value.length) return;
  input.value = formatAsYouType(input.value);
}

function setCustomValidity(control: Control) {
  if (control.dataset.format !== "phone") return;
  const value = control.value.trim();
  control.setCustomValidity(value && !isValidPhone(value) ? (control.dataset.msgFormat ?? "") : "");
}

function messageFor(field: HTMLElement): string | null {
  const controls = [...field.querySelectorAll<Control>("input, textarea")];
  if (field instanceof HTMLFieldSetElement) {
    const missing = field.dataset.required !== undefined && !controls.some((c) => (c as HTMLInputElement).checked);
    return missing ? (field.dataset.msgRequired ?? null) : null;
  }
  controls.forEach(setCustomValidity);
  const invalid = controls.find((c) => !c.checkValidity());
  if (!invalid) return null;
  const { validity, dataset } = invalid;
  if (validity.valueMissing) return field.dataset.msgRequired ?? dataset.msgRequired ?? invalid.validationMessage;
  if (validity.typeMismatch || validity.patternMismatch || validity.customError) {
    return dataset.msgFormat ?? invalid.validationMessage;
  }
  if (validity.tooLong) return dataset.msgTooLong ?? invalid.validationMessage;
  return invalid.validationMessage;
}

function showError(field: HTMLElement, message: string | null) {
  const error = field.querySelector<HTMLElement>(".field-error")!;
  field.classList.toggle("field--error", !!message);
  error.hidden = !message;
  error.textContent = "";
  if (message) {
    const prefix = document.createElement("span");
    prefix.className = "visually-hidden";
    prefix.textContent = "Error: ";
    error.appendChild(prefix);
    error.appendChild(document.createTextNode(message));
  }

  field.querySelectorAll<Control>("input, textarea").forEach((c) => {
    if (message) {
      c.setAttribute("aria-invalid", "true");
      c.setAttribute("aria-describedby", error.id);
    } else {
      c.removeAttribute("aria-invalid");
      c.removeAttribute("aria-describedby");
    }
  });
}

function showSummary(summary: HTMLElement, errors: { field: HTMLElement; message: string }[], note?: string) {
  const list = summary.querySelector("ul")!;
  list.textContent = "";

  for (const { field, message } of errors) {
    const link = document.createElement("a");
    link.href = `#${field.dataset.field}`;
    link.textContent = message;
    const item = document.createElement("li");
    item.appendChild(link);
    list.appendChild(item);
  }
  if (note) {
    const item = document.createElement("li");
    item.textContent = note;
    list.appendChild(item);
  }

  summary.hidden = false;
  summary.focus();
  if (!document.title.startsWith("Error: ")) document.title = `Error: ${document.title}`;
}
