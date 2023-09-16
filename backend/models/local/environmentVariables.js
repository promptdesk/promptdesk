import db from './db.js';
import { randomBytes } from 'crypto';

class Model {

    generateRandomId() {
        return randomBytes(8).toString('hex');
    }

    updateDatabase() {
        db.write();
    }

    createModel(model) {
        model.id = this.generateRandomId();
        db.data.models.push(model);
        this.updateDatabase();
        return model.id;
    }

    findModel(id) {
        return db.data.models.find(model => model.id === id) || null;
    }

    updateModelById(model) {
        const index = db.data.models.findIndex(m => m.id === model.id);
        if (index !== -1) {
            db.data.models[index] = { ...db.data.models[index], ...model };
            this.updateDatabase();
            return db.data.models[index];
        }
        return null;
    }

    deleteModel(id) {
        const index = db.data.models.findIndex(model => model.id === id);
        if (index !== -1) {
            db.data.models.splice(index, 1);
            this.updateDatabase();
            return id;
        }
        return null;
    }

    countModels() {
        return db.data.models.length;
    }

    listModels() {
        return db.data.models;
    }
}

export default Model;