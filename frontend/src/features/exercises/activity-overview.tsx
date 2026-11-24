"use client";
import { useState } from "react";
import { Target } from "lucide-react";
import type { Activity } from "./activity";
const dayMs = 86400000;
const months = new Intl.DateTimeFormat("fr-FR", {
  month: "short",
  timeZone: "UTC",
});
const fullDate = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeZone: "UTC",
});
export function ActivityOverview({
  activity,
  challenge,
  unavailable,
}: {
  activity: Activity;
  unavailable: boolean;
  challenge?: { id: string; title: string };
}) {
  const [picked, setPicked] = useState(activity.today);
  const start = Date.parse(activity.today) - 364 * dayMs;
  const firstDay = new Date(start).toISOString().slice(0, 10);
  const offset = (new Date(start).getUTCDay() + 6) % 7;
  const dates = Array.from(
    { length: 365 },
    (_, i) => new Date(start + i * dayMs),
  );
  const counts = Object.values(activity.days);
  const pickedCount = activity.days[picked] ?? 0;
  return (
    <>
      <dl className="stat-strip">
        <div>
          <dt>Exercices sur un an</dt>
          <dd>{counts.reduce((a, b) => a + b, 0)}</dd>
        </div>
        <div>
          <dt>Jours de pratique</dt>
          <dd>{counts.length}</dd>
        </div>
        <div>
          <dt>Aujourd’hui</dt>
          <dd>{activity.days[activity.today] ?? 0}</dd>
        </div>
      </dl>
      <section className="daily-challenge">
        <Target aria-hidden="true" size={28} />
        <div>
          <h2>Défi du jour</h2>
          <p>
            {challenge?.title ??
              (unavailable
                ? "Défi temporairement indisponible."
                : "Terminez le diagnostic pour découvrir votre défi.")}
          </p>
        </div>
        {challenge && (
          <a
            className="button"
            href={"/dashboard?challenge=" + activity.today + "#exercise-title"}
          >
            {activity.completed.includes(challenge.id)
              ? "Revoir le défi terminé"
              : "Ouvrir le défi"}
          </a>
        )}
      </section>
      <section className="activity-panel">
        <h2>Calendrier d’activité</h2>
        <p>Exercices terminés sur les 365 derniers jours</p>
        <div className="calendar-parts">
          {[0, 26].map((first, part) => {
            const end = part === 0 ? 26 : Math.ceil((365 + offset) / 7);
            return (
              <svg
                key={first}
                viewBox={"0 0 " + (end - first) * 12 + " 105"}
                role="img"
                aria-label={
                  part === 0
                    ? "Première moitié de l’année"
                    : "Deuxième moitié de l’année"
                }
              >
                {dates.map((date, i) => {
                  const week = Math.floor((i + offset) / 7);
                  if (week < first || week >= end) return null;
                  const key = date.toISOString().slice(0, 10),
                    count = activity.days[key] ?? 0,
                    x = (week - first) * 12;
                  return (
                    <g key={key}>
                      {date.getUTCDate() === 1 && week < end - 2 && (
                        <text x={x} y={10}>
                          {months.format(date)}
                        </text>
                      )}
                      <rect
                        x={x}
                        y={18 + ((i + offset) % 7) * 12}
                        width="10"
                        height="10"
                        rx="2"
                        className={"intensity-" + Math.min(count, 3)}
                        onClick={() => setPicked(key)}
                      >
                        <title>
                          {`${fullDate.format(date)} · ${count} exercice(s)`}
                        </title>
                      </rect>
                    </g>
                  );
                })}
              </svg>
            );
          })}
        </div>
        <div className="calendar-inspect">
          <label>
            Consulter un jour{" "}
            <input
              type="date"
              min={firstDay}
              max={activity.today}
              value={picked}
              onChange={(e) => {
                if (e.target.value && e.target.validity.valid)
                  setPicked(e.target.value);
              }}
            />
          </label>
          <span aria-live="polite">
            {pickedCount} exercice{pickedCount > 1 ? "s" : ""}
          </span>
          <span className="calendar-legend">
            Moins{" "}
            {[0, 1, 2, 3].map((i) => (
              <i aria-hidden="true" className={"intensity-" + i} key={i} />
            ))}{" "}
            Plus
          </span>
        </div>
      </section>
    </>
  );
}
