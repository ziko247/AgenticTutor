import { diagnosticBanks } from "../src/features/diagnostic/banks";
import { profileQuestions } from "../src/features/diagnostic/questions";
import { test, expect, type Page } from "@playwright/test";
async function createAccount(page: Page) {
  await page.goto("/sign-up");
  await page.locator("#name").fill("Test");
  await page
    .locator("#email")
    .fill("diagnostic-" + crypto.randomUUID() + "@example.invalid");
  await page.locator("#password").fill("test-only-123");
  await page
    .getByRole("button", { name: "Créer mon compte", exact: true })
    .click();
  await expect(page).toHaveURL(/\/dashboard$/);
}
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
test("auth registers, persists a profile, and signs out", async ({ page }) => {
  await page.goto("/sign-up");
  await page
    .getByRole("button", { name: "Créer mon compte", exact: true })
    .click();
  await expect(page.getByText("Indiquez votre prénom.")).toBeVisible();
  await expect(page.locator("#name")).toBeFocused();
  await page.locator("#name").fill("Test");
  const accountEmail = "e2e-" + Date.now() + "@example.invalid";
  await page.locator("#email").fill(accountEmail);
  await page.locator("#password").fill("test-only-123");
  await page.getByRole("button", { name: "Afficher le mot de passe" }).click();
  await expect(page.locator("#password")).toHaveAttribute("type", "text");
  await page
    .getByRole("button", { name: "Créer mon compte", exact: true })
    .click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(
    page.getByRole("heading", { name: "Votre espace d’apprentissage" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Calendrier d’activité" }),
  ).toBeVisible();
  await expect(page.locator(".calendar-parts rect")).toHaveCount(365);
  await page.getByRole("link", { name: "AgenticTutor, accueil" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Mon espace" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Se connecter", exact: true }),
  ).toHaveCount(0);
  await page.goto("/dashboard");

  expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain(
    "test-only-123",
  );
  const menu = page.locator(".account-menu summary");
  await menu.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("link", { name: "Paramètres" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await menu.click();
  await page.getByRole("link", { name: "Paramètres" }).click();
  await expect(page.getByRole("heading", { name: "Paramètres" })).toBeVisible();
  await menu.click();
  await page.getByRole("link", { name: "Mon profil" }).click();
  await expect(page.getByText(accountEmail)).toBeVisible();
  await page.locator("#profile-name").fill("Profile edited");
  await page
    .getByRole("button", { name: "Enregistrer le profil", exact: true })
    .click();
  await expect(page.getByRole("status")).toHaveText("Profil enregistré.");
  await page.reload();
  await expect(page.locator("#profile-name")).toHaveValue("Profile edited");
  expect(
    (await page.context().cookies())
      .filter((c) => c.name.startsWith("sb-"))
      .every((c) => c.httpOnly),
  ).toBeTruthy();
  await expect(page.getByRole("heading", { name: "Mon profil" })).toBeVisible();
  await menu.click();
  await page
    .getByRole("button", { name: "Se déconnecter", exact: true })
    .click();
  await expect(page).toHaveURL(/\/sign-in$/);
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/sign-in$/);
  for (const route of [
    "/dashboard/profile",
    "/dashboard/settings",
    "/onboarding",
  ]) {
    await page.goto(route);
    await expect(page).toHaveURL(/\/sign-in$/);
  }
  await page.goto("/sign-in");
  await page.getByRole("button", { name: "Se connecter", exact: true }).click();
  await expect(page.locator("#email")).toHaveAttribute("aria-invalid", "true");
  await page.locator("#email").fill("test@example.com");
  await page.locator("#password").fill("test-only-123");
  await page.getByRole("button", { name: "Se connecter", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Connexion impossible");
  await expect(page).toHaveURL(/\/sign-in$/);
  await page.locator("#email").fill(accountEmail);
  await page.getByRole("button", { name: "Se connecter", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await page.goto("/reset-password");
  await page.locator("#recovery-field").fill("must-not-change-123");
  await page.getByRole("button", { name: "Enregistrer", exact: true }).click();
  await expect(page.getByRole("status")).toContainText(
    "lien n’est plus valide",
  );
  await page.goto("/dashboard");
  await menu.click();
  await page
    .getByRole("button", { name: "Se déconnecter", exact: true })
    .click();
  await page.goto("/forgot-password");
  await page.locator("#recovery-field").fill(accountEmail);
  await page.getByRole("button", { name: "Recevoir un lien" }).click();
  await expect(page.getByRole("status")).toContainText(
    "un e-mail vous a été envoyé",
  );
  let messageId = "";
  await expect
    .poll(async () => {
      const result = await (
        await page.request.get("http://127.0.0.1:58424/api/v1/messages")
      ).json();
      const message = result.messages.find(
        (m: { ID: string; To: { Address: string }[] }) =>
          m.To.some((t) => t.Address === accountEmail),
      );
      messageId = message?.ID || "";
      return Boolean(messageId);
    })
    .toBeTruthy();
  const mail = await (
    await page.request.get("http://127.0.0.1:58424/api/v1/message/" + messageId)
  ).json();
  const links = Array.from(String(mail.HTML).matchAll(/href="([^"]+)"/g), (m) =>
    m[1].replaceAll("&amp;", "&"),
  );
  const recoveryLink = links.find((link) =>
    link.startsWith("http://127.0.0.1:58421/auth/v1/verify"),
  );
  expect(Boolean(recoveryLink)).toBeTruthy();
  await page.goto(recoveryLink!);
  await expect(page).toHaveURL(/\/reset-password$/);
  await page.locator("#recovery-field").fill("new-test-password-123");
  await page.getByRole("button", { name: "Enregistrer", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Mot de passe modifié");
  await page.goto("/sign-in");
  await page.locator("#email").fill(accountEmail);
  await page.locator("#password").fill("new-test-password-123");
  await page.getByRole("button", { name: "Se connecter", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
});
test("language diagnostic persists, reviews, scores and resets", async ({
  page,
}) => {
  test.setTimeout(90_000);
  await createAccount(page);
  await page
    .getByRole("link", { name: "Commencer le diagnostic", exact: true })
    .click();
  await expect(page.locator(".storage-note [role=status]")).toHaveText(
    "Vos réponses seront enregistrées sur votre compte.",
  );
  await page.getByRole("button", { name: "JavaScript", exact: true }).click();
  await page.getByRole("button", { name: "Continuer", exact: true }).click();
  await expect(page.locator(".form-error")).toContainText("Choisissez");
  // A transport failure must release the busy state and roll back the optimistic selection.
  await page.route("**/onboarding", (route) => route.abort(), { times: 1 });
  await page.getByRole("radio").first().click();
  await expect(page.locator(".storage-note [role=status]")).toHaveText(
    "Modification non enregistrée.",
  );
  await expect(page.getByRole("radio").first()).not.toBeChecked();
  await page.getByRole("radio").first().check();
  await page.getByRole("button", { name: "Continuer", exact: true }).click();
  await page.getByText("Question 2 sur 16", { exact: true }).waitFor();
  await page.goto("/dashboard");
  await page.getByRole("link", { name: "Reprendre le diagnostic" }).click();
  await expect(
    page.getByText("Question 2 sur 16", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Précédent", exact: true }).click();
  await expect(page.getByRole("radio").first()).toBeChecked();
  for (let i = 0; i < 16; i++) {
    await page.getByRole("radio").last().check();
    await expect(page.locator(".storage-note [role=status]")).toHaveText(
      "Diagnostic enregistré sur votre compte.",
    );
    await page
      .getByRole("button", {
        name: i === 15 ? "Vérifier mes réponses" : "Continuer",
        exact: true,
      })
      .click();
    if (i < 15)
      await expect(
        page.getByText(`Question ${i + 2} sur 16`, { exact: true }),
      ).toBeVisible();
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
  await page.goto("/dashboard");
  await expect(
    page.getByText("Diagnostic terminé. Votre résultat : 2 / 20."),
  ).toBeVisible();
  await page.goto("/dashboard/profile");
  await expect(page.locator("#profile-language")).toHaveValue("javascript");
  await expect(page.getByText("JavaScript · 2 / 20")).toBeVisible();
  await page.goto("/dashboard");
  await expect(page.getByLabel("Style d’explication")).toHaveValue("image");
  await page.getByText("Lire un indice", { exact: true }).click();
  await expect(
    page.getByText("Repérez l’opération effectuée en premier."),
  ).toBeVisible();
  await page.getByText("Comparer avec la correction").click();
  await page.getByLabel("Style d’explication").selectOption("brief");
  await expect(
    page.getByText("La multiplication précède l’addition."),
  ).toBeVisible();
  await page.getByLabel("Exercice en JavaScript").selectOption("9");
  await expect(
    page.getByText("Lire une transformation", { exact: true }).last(),
  ).toBeVisible();
  const title = await page.locator(".daily-challenge p").innerText();
  await page.getByRole("link", { name: "Ouvrir le défi" }).click();
  await expect(page.locator(".practice-sheet h3")).toHaveText(title);
  const exercisePicker = page.getByLabel("Exercice en JavaScript");
  const otherIndex = (Number(await exercisePicker.inputValue()) + 1) % 10;
  await exercisePicker.selectOption(String(otherIndex));
  await page.getByRole("link", { name: "Ouvrir le défi" }).click();
  await expect(page.locator(".practice-sheet h3")).toHaveText(title);
  await page.getByRole("button", { name: "Marquer comme terminé" }).click();
  await expect(page.locator(".stat-strip dd").last()).toHaveText("1");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Terminé aujourd’hui" }),
  ).toBeDisabled();
  await expect(
    page.getByRole("link", { name: "Revoir le défi terminé" }),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.getByRole("link", { name: "Voir mon résultat" }).click();
  await expect(page.locator(".summary-line strong")).toHaveText("2 / 20");
  await page
    .getByRole("button", { name: "Recommencer le diagnostic", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Quel langage souhaitez-vous apprendre ?",
    }),
  ).toBeVisible();
});

test("corrupt storage recovers", async ({ page }) => {
  await createAccount(page);
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
  await createAccount(page);
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw Error("blocked");
    };
    Storage.prototype.getItem = () => {
      throw Error("blocked");
    };
  });
  await page.goto("/onboarding");
  await expect(page.getByRole("status")).toContainText("compte");
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
    for (const route of [
      "/",
      "/sign-in",
      "/sign-up",
      "/onboarding",
      "/dashboard",
    ]) {
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
  for (const route of ["/", "/dashboard"]) {
    await page.goto(route);
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
  }
});
test("all ten language banks finish with a score out of twenty", async ({
  page,
}) => {
  await createAccount(page);
  test.setTimeout(180_000);
  for (const [index, language] of [
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
  ].entries()) {
    await page.goto("/onboarding");
    await expect(page.locator(".storage-note [role=status]")).toContainText(
      "compte",
    );
    if (index > 0)
      await page
        .getByRole("button", { name: "Recommencer le diagnostic" })
        .click();
    const choice = page.getByRole("button", { name: language, exact: true });
    await expect(choice).toBeVisible();
    await choice.click();
    for (let i = 0; i < 16; i++) {
      await page.getByRole("radio").last().check();
      await expect(page.locator(".storage-note [role=status]")).toHaveText(
        "Diagnostic enregistré sur votre compte.",
      );
      await page
        .getByRole("button", {
          name: i === 15 ? "Vérifier mes réponses" : "Continuer",
          exact: true,
        })
        .click();
      if (i < 15)
        await expect(
          page.getByText(`Question ${i + 2} sur 16`, { exact: true }),
        ).toBeVisible();
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
  await createAccount(page);
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
  test.setTimeout(90_000);
  await createAccount(page);
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.setItem("agentictutor.onboarding.v1", "legacy-draft");
    localStorage.setItem("agentictutor.onboarding.v2", "legacy-v2");
  });
  await page.goto("/onboarding");
  await page.getByRole("button", { name: "Python", exact: true }).click();
  const answers = [
    ...profileQuestions.map(() => 0),
    ...diagnosticBanks.python.map((q) => q.correct!),
  ];
  for (let i = 0; i < 16; i++) {
    await page.getByRole("radio").nth(answers[i]).check();
    await expect(page.locator(".storage-note [role=status]")).toHaveText(
      "Diagnostic enregistré sur votre compte.",
    );
    await page
      .getByRole("button", {
        name: i === 15 ? "Vérifier mes réponses" : "Continuer",
        exact: true,
      })
      .click();
    if (i < 15)
      await expect(
        page.getByText(`Question ${i + 2} sur 16`, { exact: true }),
      ).toBeVisible();
  }
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

test("smooth scrolling respects reduced motion and anchor navigation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/lenis/);
  await page.locator("#lesson-language").click();
  const menu = page.locator("#lesson-language-menu .language-menu-list");
  await menu.hover();
  await page.mouse.wheel(0, 400);
  await expect
    .poll(() => menu.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(0);
  await page.keyboard.press("Escape");
  await page.getByRole("link", { name: "Découvrir l’approche" }).click();
  await expect
    .poll(
      () =>
        page
          .locator("#approche")
          .evaluate((el) => Math.abs(el.getBoundingClientRect().top)),
      { timeout: 5000 },
    )
    .toBeLessThan(5);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).not.toHaveClass(/lenis/);
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("html")).toHaveClass(/lenis/);
});

test("expired recovery link offers a new link", async ({ page }) => {
  await page.goto("/#error=access_denied&error_code=otp_expired");
  await expect(page).toHaveURL(/\/forgot-password\?error=invalid_link/);
  await expect(page.getByRole("status")).toContainText("invalide ou expiré");
  await expect(
    page.getByRole("button", { name: "Recevoir un lien" }),
  ).toBeVisible();
});

test("Google sign-in starts the OAuth redirect", async ({ page }) => {
  await page.route("https://accounts.google.com/**", (route) =>
    route.fulfill({ status: 200, body: "Google sign-in" }),
  );
  await page.goto("/sign-in");
  await page.getByRole("button", { name: "Continuer avec Google" }).click();
  await expect(page).toHaveURL(new RegExp("^https://accounts[.]google[.]com/"));
});
