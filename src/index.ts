import {setupApp} from "./setup-app";
import {runDb} from "./db/mongo.db";
import {SETTINGS} from "./core/settings/settings";
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

