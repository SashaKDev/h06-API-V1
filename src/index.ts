import {setupApp} from "./setup-app.js";
import {runDb} from "./db/mongo.db.js";
import {SETTINGS} from "./core/settings/settings.js";
import dotenv from 'dotenv';
dotenv.config();

    const app = setupApp();

    const PORT = process.env.PORT || 3000;

    const bootsTrap = async () => {
        await runDb(SETTINGS.MONGO_URL);

        app.listen(PORT, () => console.log(`Listening on ${PORT}`));

        return app;

    }

bootsTrap();

