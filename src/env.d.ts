declare namespace App {
  interface Locals {
    // Set by the middleware on /admin paths only.
    admin?: import("./server/shared/access").Admin;
  }
}
