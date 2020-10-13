import Faker from 'faker'

abstract class Seeder {

	abstract run(): Promise<void>

	public async handle(): Promise<void> {
		console.info(`Seeding ${this.constructor.name}`);

		await this.run();
	}

	protected fake(): Faker.FakerStatic {
		return Faker;
	}

}

export default Seeder
