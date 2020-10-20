abstract class Migration {

	public async handle(): Promise<void> {
		console.info(`Migrating ${this.constructor.name}`);

		await this.run();
	}

	protected async run() {
		console.log('Running migration');
	}

}

export default Migration
