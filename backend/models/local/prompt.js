import db from './db.js';
import crypto from 'crypto';

class Prompt {
    updateDatabase() {
        db.write();
    }

    generateRandomId() {
        return crypto.randomBytes(10).toString('hex');
    }

    createPrompt(prompt) {
        prompt.id = this.generateRandomId();
        db.data.prompts.push(prompt);
        this.updateDatabase();
        return prompt.id;
    }

    findPrompt(id) {
        return db.data.prompts.find(prompt => prompt.id === id) || null;
    }

    findPromptByName(name) {
        return db.data.prompts.find(prompt => prompt.name === name) || null;
    }

    updatePromptById(prompt) {
        const index = db.data.prompts.findIndex(p => p.id === prompt.id);
        if (index !== -1) {
            db.data.prompts[index] = { ...db.data.prompts[index], ...prompt };
            this.updateDatabase();
            return db.data.prompts[index];
        }
        return null;
    }

    deletePrompt(id) {
        const index = db.data.prompts.findIndex(prompt => prompt.id === id);
        if (index !== -1) {
            db.data.prompts.splice(index, 1);
            this.updateDatabase();
            return id;
        }
        return null;
    }

    countPrompts() {
        return db.data.prompts.length;
    }

    listPrompts() {
        return db.data.prompts;
    }
}

export default Prompt;