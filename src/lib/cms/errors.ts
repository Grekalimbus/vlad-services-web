export class CmsUnavailableError extends Error {
  constructor(message = "CMS content is unavailable.") {
    super(message);
    this.name = "CmsUnavailableError";
  }
}
