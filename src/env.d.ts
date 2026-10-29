declare namespace App {
  interface Locals {
    // Set by the middleware on /admin paths only.
    adminEmail?: string;
  }
}
