// Global store — will become: export const useStore = create<AppStore>(...)
// Depends on globals: generateId (uuid.js), loadFromStorage / saveToStorage /
// exportDatabase (fileIO.js), pullRandomStar / getAllTags (starEngine.js)

const SCHEMA_VERSION = '1.0.0';

class Store {
  constructor() {
    const saved = loadFromStorage();
    if (saved) {
      this.stars    = saved.stars    || [];
      this.people   = saved.people   || [];
      this.isOnboarded = saved.isOnboarded !== undefined ? saved.isOnboarded : false;
    } else {
      this.stars    = [];
      this.people   = [];
      this.isOnboarded = false;
    }
    this._listeners = [];
  }

  subscribe(fn) {
    this._listeners.push(fn);
    return () => { this._listeners = this._listeners.filter(l => l !== fn); };
  }

  _notify() {
    this._save();
    this._listeners.forEach(fn => fn());
  }

  _save() {
    saveToStorage({
      version:    SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      stars:      this.stars,
      people:     this.people,
      isOnboarded: this.isOnboarded,
    });
  }

  // ── Star actions ────────────────────────────────────────────────────────────

  addStar({ message, from_people_ids = [], date, tags = [], favourite = false }) {
    const now = new Date().toISOString();
    const star = {
      star_id:         generateId(),
      message,
      from_people_ids,
      date:            date || new Date().toISOString().split('T')[0],
      tags,
      favourite,
      pull_count:      0,
      created_at:      now,
      updated_at:      now,
    };
    this.stars = [star, ...this.stars];
    from_people_ids.forEach(pid => {
      const p = this.people.find(p => p.people_id === pid);
      if (p && !p.star_ids.includes(star.star_id)) {
        p.star_ids = [...p.star_ids, star.star_id];
      }
    });
    this._notify();
    window.driveSync?.scheduleSave();
    return star;
  }

  updateStar(id, updates) {
    const prev = this.stars.find(s => s.star_id === id);
    this.stars = this.stars.map(s =>
      s.star_id !== id ? s : { ...s, ...updates, updated_at: new Date().toISOString() }
    );
    // Keep people.star_ids in sync when from_people_ids changes
    if (updates.from_people_ids && prev) {
      const removed = prev.from_people_ids.filter(pid => !updates.from_people_ids.includes(pid));
      const added   = updates.from_people_ids.filter(pid => !prev.from_people_ids.includes(pid));
      removed.forEach(pid => {
        const p = this.people.find(p => p.people_id === pid);
        if (p) p.star_ids = p.star_ids.filter(sid => sid !== id);
      });
      added.forEach(pid => {
        const p = this.people.find(p => p.people_id === pid);
        if (p && !p.star_ids.includes(id)) p.star_ids = [...p.star_ids, id];
      });
    }
    this._notify();
    window.driveSync?.scheduleSave();
  }

  deleteStar(id) {
    this.stars  = this.stars.filter(s => s.star_id !== id);
    this.people = this.people.map(p => ({
      ...p,
      star_ids: p.star_ids.filter(sid => sid !== id),
    }));
    this._notify();
    window.driveSync?.scheduleSave();
  }

  pullRandomStar(favouritesOnly = false) {
    const star = pullRandomStar(this.stars, favouritesOnly);
    if (!star) return null;
    this.updateStar(star.star_id, { pull_count: star.pull_count + 1 });
    return this.stars.find(s => s.star_id === star.star_id);
  }

  // ── People actions ──────────────────────────────────────────────────────────

  addPerson({ name, note = '', avatar_id = 'avatar_01' }) {
    const now = new Date().toISOString();
    const person = {
      people_id:  generateId(),
      name,
      note,
      avatar_id,
      star_ids:   [],
      is_new:     true,
      created_at: now,
    };
    this.people = [person, ...this.people];
    this._notify();
    window.driveSync?.scheduleSave();
    return person;
  }

  updatePerson(id, updates) {
    this.people = this.people.map(p => p.people_id === id ? { ...p, ...updates } : p);
    this._notify();
    window.driveSync?.scheduleSave();
  }

  deletePerson(id) {
    this.people = this.people.filter(p => p.people_id !== id);
    // Remove this person from every star's from_people_ids
    this.stars = this.stars.map(s => ({
      ...s,
      from_people_ids: (s.from_people_ids || []).filter(pid => pid !== id),
    }));
    this._notify();
    window.driveSync?.scheduleSave();
  }

  clearNewFlags() {
    this.people = this.people.map(p => ({ ...p, is_new: false }));
    this._notify();
  }

  setOnboarded() {
    this.isOnboarded = true;
    this._notify();
    window.driveSync?.scheduleSave();
  }

  // ── IO actions ──────────────────────────────────────────────────────────────

  // skipSync: true when called by driveSync itself (avoids immediate write-back after load)
  importDatabase(db, skipSync = false) {
    this.stars       = db.stars  || [];
    this.people      = db.people || [];
    this.isOnboarded = true;
    this._notify();
    if (!skipSync) window.driveSync?.scheduleSave();
  }

  exportRaw() {
    return {
      version:     SCHEMA_VERSION,
      exportedAt:  new Date().toISOString(),
      stars:       this.stars,
      people:      this.people,
      isOnboarded: this.isOnboarded,
    };
  }

  exportDatabase() {
    exportDatabase(this.exportRaw());
  }

  getAllTags() {
    return getAllTags(this.stars);
  }
}

window.store = new Store();
