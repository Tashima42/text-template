import { buildTemplateFormRepository } from "./template-form";
import { buildTemplatesRepository } from "./templates";

const templateFormRepository = buildTemplateFormRepository();
const templatesRepository = buildTemplatesRepository();

export {
  templateFormRepository,
  templatesRepository,
}
