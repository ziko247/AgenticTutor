import { test, expect } from "@playwright/test";
test("interactive lesson", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Un indice, s’il vous plaît" })
    .click();
  await expect(
    page.getByText("Le comptage commence à 0.", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Voir le résultat" }).click();
  await expect(page.getByText("0, 1, puis 2.")).toBeVisible();
  await page
    .getByRole("link", { name: "Préparer mon parcours" })
    .first()
    .click();
  await expect(page).toHaveURL(/sign-up/);
});
test("auth validates without fake authentication", async ({ page }) => {
  await page.goto("/sign-up");
  await page
    .getByRole("button", { name: "Créer mon compte", exact: true })
    .click();
  await expect(page.getByText("Indiquez votre prénom.")).toBeVisible();
  await expect(page.locator("#name")).toBeFocused();
  await page.locator("#name").fill("Test");
  await page.locator("#email").fill("test@example.com");
  await page.locator("#password").fill("test-only-123");
  await page.getByRole("button", { name: "Afficher le mot de passe" }).click();
  await expect(page.locator("#password")).toHaveAttribute("type", "text");
  await page
    .getByRole("button", { name: "Créer mon compte", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "aucune connexion effectuée",
  );
  expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain(
    "test-only-123",
  );
  await page.goto("/sign-in");
  await page.getByRole("button", { name: "Se connecter", exact: true }).click();
  await expect(page.locator("#email")).toHaveAttribute("aria-invalid", "true");
});
test("20 answers persist, review, edit, complete, reset", async ({ page }) => {
  await page.goto("/onboarding");
  await expect(
    page.getByText("Question 1 sur 20", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Continuer", exact: true }).click();
  await expect(page.locator(".form-error[role=alert]")).toContainText(
    "Choisissez",
  );
  await page.getByRole("radio").first().check();
  await page.getByRole("button", { name: "Continuer", exact: true }).click();
  await page.reload();
  await expect(
    page.getByText("Question 2 sur 20", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Précédent" }).click();
  await expect(page.getByRole("radio").first()).toBeChecked();
  await page.getByRole("button", { name: "Continuer", exact: true }).click();
  for (let i = 1; i < 20; i++) {
    await page.getByRole("radio").first().check();
    await page
      .getByRole("button", {
        name: i === 19 ? "Vérifier mes réponses" : "Continuer",
        exact: true,
      })
      .click();
  }
  await expect(
    page.getByRole("heading", { name: "Tout vous ressemble ?" }),
  ).toBeVisible();
  await expect(page.locator(".review-list li")).toHaveCount(20);
  await page
    .getByRole("button", { name: "Modifier la réponse 1", exact: true })
    .click();
  await page.getByRole("radio").nth(1).check();
  await page.getByRole("button", { name: "Revenir au récapitulatif" }).click();
  await expect(page.locator(".review-list li").first()).toContainText(
    "Licence",
  );
  await page.getByRole("button", { name: "Terminer le diagnostic" }).click();
  await expect(
    page.getByRole("heading", { name: "Un premier pas, déjà accompli." }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Un premier pas, déjà accompli." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Effacer et recommencer" }).click();
  await expect(
    page.getByText("Question 1 sur 20", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("radio").first()).not.toBeChecked();
});
test("corrupt storage recovers", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem("agentictutor.onboarding.v1", "{broken"),
  );
  await page.goto("/onboarding");
  await expect(
    page.getByText("Question 1 sur 20", { exact: true }),
  ).toBeVisible();
});
test("blocked storage keeps flow usable", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error("blocked");
    };
    Storage.prototype.getItem = () => {
      throw new Error("blocked");
    };
  });
  await page.goto("/onboarding");
  await expect(
    page.getByText(
      "Sauvegarde locale indisponible. Gardez cette page ouverte.",
    ),
  ).toBeVisible();
  await page.getByRole("radio").first().check();
  await page.getByRole("button", { name: "Continuer", exact: true }).click();
  await expect(
    page.getByText("Question 2 sur 20", { exact: true }),
  ).toBeVisible();
});
test("responsive routes", async ({ page }) => {
  for (const width of [375, 768, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/sign-in", "/sign-up", "/onboarding"]) {
      await page.goto(route);
      await page.locator("h1").waitFor();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    }
  }
});
test("keyboard focus and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Aller au contenu" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  expect(
    await page
      .locator(":focus")
      .evaluate((el) => getComputedStyle(el).outlineStyle),
  ).not.toBe("none");
  expect(
    await page
      .locator("html")
      .evaluate((el) => getComputedStyle(el).scrollBehavior),
  ).toBe("auto");
});
