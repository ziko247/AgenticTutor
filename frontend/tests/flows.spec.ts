import { diagnosticBanks } from "../src/features/diagnostic/banks";
import { profileQuestions } from "../src/features/diagnostic/questions";
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
test("language diagnostic persists, reviews, scores and resets", async ({
  page,
}) => {
  await page.goto("/onboarding");
  await page.getByRole("button", { name: "JavaScript", exact: true }).click();
  await page.getByRole("button", { name: "Continuer", exact: true }).click();
  await expect(page.locator(".form-error")).toContainText("Choisissez");
  await page.getByRole("radio").first().check();
  await page.getByRole("button", { name: "Continuer", exact: true }).click();
  await page.reload();
  await expect(
    page.getByText("Question 2 sur 16", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Précédent", exact: true }).click();
  await expect(page.getByRole("radio").first()).toBeChecked();
  for (let i = 0; i < 16; i++) {
    await page.getByRole("radio").last().check();
    await page
      .getByRole("button", {
        name: i === 15 ? "Vérifier mes réponses" : "Continuer",
        exact: true,
      })
      .click();
  }
  await expect(page.locator(".review-list li")).toHaveCount(16);
  await page
    .getByRole("button", { name: "Modifier la réponse 7", exact: true })
    .click();
  await page.getByRole("radio").first().check();
  await page
    .getByRole("button", { name: "Revenir au récapitulatif", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Terminer le diagnostic", exact: true })
    .click();
  await expect(page.locator(".summary-line strong")).toHaveText("2 / 20");
  await page.reload();
  await expect(page.locator(".summary-line strong")).toHaveText("2 / 20");
  await page
    .getByRole("button", { name: "Effacer et recommencer", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Quel langage souhaitez-vous apprendre ?",
    }),
  ).toBeVisible();
});

test("corrupt storage recovers", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem("agentictutor.onboarding.v2", "{broken"),
  );
  await page.goto("/onboarding");
  await expect(
    page.getByRole("heading", {
      name: "Quel langage souhaitez-vous apprendre ?",
    }),
  ).toBeVisible();
});

test("blocked storage keeps flow usable", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw Error("blocked");
    };
    Storage.prototype.getItem = () => {
      throw Error("blocked");
    };
  });
  await page.goto("/onboarding");
  await expect(page.getByRole("status")).toContainText("indisponible");
  await page.getByRole("button", { name: "Python", exact: true }).click();
  await page.getByRole("radio").first().check();
  await page.getByRole("button", { name: "Continuer", exact: true }).click();
  await expect(
    page.getByText("Question 2 sur 16", { exact: true }),
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
test("all eleven language banks finish with a score out of twenty", async ({
  page,
}) => {
  for (const language of [
    "Python",
    "C",
    "C++",
    "C#",
    "Java",
    "HTML",
    "CSS",
    "JavaScript",
    "Go",
    "Rust",
    "MySQL",
  ]) {
    await page.goto("/");
    await page.evaluate(() =>
      localStorage.removeItem("agentictutor.onboarding.v2"),
    );
    await page.goto("/onboarding");
    await page.getByRole("button", { name: language, exact: true }).click();
    for (let i = 0; i < 16; i++) {
      await page.getByRole("radio").last().check();
      await page
        .getByRole("button", {
          name: i === 15 ? "Vérifier mes réponses" : "Continuer",
          exact: true,
        })
        .click();
    }
    await page
      .getByRole("button", { name: "Terminer le diagnostic", exact: true })
      .click();
    await expect(page.locator(".summary-line strong")).toHaveText("0 / 20");
    await expect(page.locator(".summary-line")).toContainText(language);
  }
});
test("changing language clears answers only after confirmation", async ({
  page,
}) => {
  await page.goto("/onboarding");
  await page.getByRole("button", { name: "Rust", exact: true }).click();
  await page.getByRole("radio").first().check();
  page.once("dialog", (d) => d.dismiss());
  await page
    .getByRole("button", { name: "Changer de langage", exact: true })
    .click();
  await expect(page.getByRole("radio").first()).toBeChecked();
  page.once("dialog", (d) => d.accept());
  await page
    .getByRole("button", { name: "Changer de langage", exact: true })
    .click();
  await page.getByRole("button", { name: "HTML", exact: true }).click();
  await expect(page.getByRole("radio").first()).not.toBeChecked();
});

test("language menus support mouse and keyboard", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator("#lesson-language");
  const worked = page.locator("#worked-language");
  await hero.click();
  await expect(hero).toHaveAttribute("aria-expanded", "true");
  await page
    .locator("#lesson-language-menu")
    .getByText("JavaScript", { exact: true })
    .click();
  await expect(page.locator(".lesson pre")).toContainText("console.log(n)");
  await expect(worked).toContainText("Python");
  await worked.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.locator("#worked-language-menu").getByLabel("Python", { exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(worked).toBeFocused();
  await expect(worked).toHaveAttribute("aria-expanded", "false");
  await worked.click();
  await page
    .locator("#worked-language-menu")
    .getByText("CSS", { exact: true })
    .click();
  await expect(page.locator("#exemple .example-output strong")).toHaveText("3");
  await page.setViewportSize({ width: 375, height: 900 });
  await hero.click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.locator("h1").click();
  await expect(hero).toHaveAttribute("aria-expanded", "false");
});

test("perfect result is twenty and old drafts remain untouched", async ({
  page,
}) => {
  await page.goto("/");
  const answers = Object.fromEntries([
    ...profileQuestions.map((q) => [q.id, 0]),
    ...diagnosticBanks.python.map((q) => [q.id, q.correct]),
  ]);
  await page.evaluate((answers) => {
    localStorage.setItem("agentictutor.onboarding.v1", "legacy-draft");
    localStorage.setItem(
      "agentictutor.onboarding.v2",
      JSON.stringify({
        version: 2,
        language: "python",
        answers,
        step: 15,
        review: true,
        completed: false,
      }),
    );
  }, answers);
  await page.goto("/onboarding");
  await page
    .getByRole("button", { name: "Terminer le diagnostic", exact: true })
    .click();
  await expect(page.locator(".summary-line strong")).toHaveText("20 / 20");
  expect(
    await page.evaluate(() =>
      localStorage.getItem("agentictutor.onboarding.v1"),
    ),
  ).toBe("legacy-draft");
});
test("each bank has ten valid independent scored questions", () => {
  for (const bank of Object.values(diagnosticBanks)) {
    expect(bank).toHaveLength(10);
    expect(new Set(bank.map((q) => q.id)).size).toBe(10);
    for (const q of bank) {
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThan(q.options.length - 1);
      expect(new Set(q.options).size).toBe(q.options.length);
    }
  }
});
