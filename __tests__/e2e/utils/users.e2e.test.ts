import {setupApp} from "../../../src/setup-app";
import {SETTINGS} from "../../../src/core/settings/settings";
import {runDb} from "../../../src/db/mongo.db";
import {MongoClient} from "mongodb";
import request from "supertest";
import {UserInputDto} from "../../../src/users/types/userInputDto";

describe ('USER_TESTS', () => {

    const app = setupApp();
    let client: MongoClient;

    const correctUserDto: UserInputDto = {
        login: "FoGi-HL_PQ",
        password: "string",
        email: "example@example.dev"
    }

    const inCorrectUserDto: UserInputDto = {
        login: "FoGi-HL_PQkiujebnvkjbnerkjvbekjbvn",
        password: "string",
        email: "example@example.dev"
    }

    const correctUserDtoArr: UserInputDto[] = [];
    for (let i = 0; i < 20; i++){
        correctUserDtoArr[i] = {
            ...correctUserDto,
            login: correctUserDto.login + i,
            email: i + correctUserDto.email
        }
    }

    beforeAll(async () => {
        client = await runDb(SETTINGS.MONGO_URL);

    });

    afterAll(async () => {
        await client.close();
    });

    beforeEach(async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(204)
    });

    it('POST: Should create User and return 201', async () => {
        const newUser = await request(app)
            .post('/users')
            .send(correctUserDto)
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .expect(201)
        expect(newUser.body).toEqual({
            id: expect.any(String),
            login: "FoGi-HL_PQ",
            email: "example@example.dev",
            createdAt: expect.any(String)
        });

    });
    it('POST: Should not create User and return 401', async () => {
        await request(app)
            .post('/users')
            .expect(401)
    });

    it('POST: Should not create User and return 400 and error message', async () => {
        const result = await request(app)
            .post('/users')
            .send(inCorrectUserDto)
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .expect(400)
        expect(result.body).toEqual({
            errorsMessages: [{message: 'Invalid login', field: 'login'}]
        });
    });

    it('GET: Should return Users list with pagination', async () => {
        await request(app)
            .post('/users')
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send(correctUserDtoArr)
            .expect(201)
    })

})