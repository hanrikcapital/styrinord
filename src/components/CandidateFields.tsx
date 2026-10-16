import {
  BOARD_EDUCATION,
  BOARD_EXPERIENCE,
  COMPETENCES,
  COUNTIES,
  DESIRED_ROLES,
  GENDERS,
  INDUSTRIES,
} from "@/lib/options";

export type Candidate = {
  full_name: string;
  birth_date: string;
  gender: string;
  phone: string | null;
  municipality: string | null;
  county: string;
  industry: string;
  position: string | null;
  competence: string[];
  board_experience: string;
  board_roles: string | null;
  board_education: string[];
  desired_roles: string[];
  bio: string | null;
  available: boolean;
  visible: boolean;
};

function Checkboxes({ name, options, checked }: { name: string; options: readonly string[]; checked: string[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((o) => (
        <label key={o} className="flex items-center gap-2 text-sm">
          <input type="checkbox" name={name} value={o} defaultChecked={checked.includes(o)} />
          {o}
        </label>
      ))}
    </div>
  );
}

export function CandidateFields({ c }: { c: Candidate | null }) {
  return (
    <>
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-2 text-lg font-semibold text-fjord-900">Om deg</legend>
        <div>
          <label className="label" htmlFor="full_name">Fullt navn *</label>
          <input className="input" id="full_name" name="full_name" required defaultValue={c?.full_name} />
        </div>
        <div>
          <label className="label" htmlFor="birth_date">Fødselsdato * <span className="font-normal text-slate-500">(bedrifter ser kun alder)</span></label>
          <input className="input" id="birth_date" name="birth_date" type="date" required defaultValue={c?.birth_date} />
        </div>
        <div>
          <label className="label" htmlFor="gender">Kjønn *</label>
          <select className="input" id="gender" name="gender" required defaultValue={c?.gender ?? ""}>
            <option value="" disabled>Velg</option>
            {GENDERS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="phone">Telefon <span className="font-normal text-slate-500">(vises ikke)</span></label>
          <input className="input" id="phone" name="phone" type="tel" defaultValue={c?.phone ?? ""} />
        </div>
        <div>
          <label className="label" htmlFor="county">Region *</label>
          <select className="input" id="county" name="county" required defaultValue={c?.county ?? ""}>
            <option value="" disabled>Velg</option>
            {COUNTIES.map((x) => <option key={x}>{x}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="municipality">Kommune</label>
          <input className="input" id="municipality" name="municipality" defaultValue={c?.municipality ?? ""} />
        </div>
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-2 text-lg font-semibold text-fjord-900">Arbeid og kompetanse</legend>
        <div>
          <label className="label" htmlFor="industry">Nåværende bransje *</label>
          <select className="input" id="industry" name="industry" required defaultValue={c?.industry ?? ""}>
            <option value="" disabled>Velg</option>
            {INDUSTRIES.map((x) => <option key={x}>{x}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="position">Nåværende stilling</label>
          <input className="input" id="position" name="position" defaultValue={c?.position ?? ""} />
        </div>
        <div className="sm:col-span-2">
          <span className="label">Kompetanseområder</span>
          <Checkboxes name="competence" options={COMPETENCES} checked={c?.competence ?? []} />
        </div>
      </fieldset>

      <fieldset className="grid gap-4">
        <legend className="mb-2 text-lg font-semibold text-fjord-900">Styrearbeid</legend>
        <div>
          <label className="label" htmlFor="board_experience">Styreerfaring *</label>
          <select className="input sm:max-w-xs" id="board_experience" name="board_experience" required defaultValue={c?.board_experience ?? ""}>
            <option value="" disabled>Velg</option>
            {BOARD_EXPERIENCE.map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="board_roles">Styreverv du har hatt <span className="font-normal text-slate-500">(selskap, rolle, år)</span></label>
          <textarea className="input" id="board_roles" name="board_roles" rows={3} defaultValue={c?.board_roles ?? ""} />
        </div>
        <div>
          <span className="label">Styreutdanning</span>
          <Checkboxes name="board_education" options={BOARD_EDUCATION} checked={c?.board_education ?? []} />
        </div>
        <div>
          <span className="label">Hvilke verv er du interessert i?</span>
          <Checkboxes name="desired_roles" options={DESIRED_ROLES} checked={c?.desired_roles ?? []} />
        </div>
        <div>
          <label className="label" htmlFor="bio">Kort presentasjon <span className="font-normal text-slate-500">(maks 1000 tegn)</span></label>
          <textarea className="input" id="bio" name="bio" rows={5} maxLength={1000} defaultValue={c?.bio ?? ""} />
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="mb-2 text-lg font-semibold text-fjord-900">Synlighet</legend>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="visible" defaultChecked={c?.visible ?? true} />
          Godkjente bedrifter kan se profilen min
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="available" defaultChecked={c?.available ?? true} />
          Jeg er tilgjengelig for nye verv nå
        </label>
      </fieldset>
    </>
  );
}
