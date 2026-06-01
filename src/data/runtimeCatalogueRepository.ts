import { createCsvCatalogueRepository } from "./catalogueRepository";
import { generatedCatalogueCsv } from "./generatedCatalogue";

export const runtimeCatalogueRepository = createCsvCatalogueRepository(async () => {
  return generatedCatalogueCsv;
});
