import { describe, expect, it } from "vitest";
import { currentExecutor, currentTestConfig, currentUploadDir } from "./setup.js";
import { testConfig } from "./helpers/config.js";

describe("outils de test", () => {
  it("crée une configuration neuve avec un dossier temporaire", () => {
    const configuration = currentTestConfig();

    expect(configuration.uploads.dir).toBe(currentUploadDir());
    expect(testConfig({ uploads: { dir: "remplacement" } }).uploads.dir).toBe("remplacement");
    expect(testConfig()).not.toBe(configuration);
  });

  it("fournit un faux exécuteur SQL fonctionnel", async () => {
    const executant = currentExecutor();

    expect(await executant.execute("SELECT 1")).toEqual([]);
    expect(executant.execute).toHaveBeenCalledOnce();
  });

  it("exécute une vérification simple avec Vitest", () => {
    expect(true).toBe(true);
  });
});
