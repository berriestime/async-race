import { z } from 'zod';

const createCarSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  color: z.string().startsWith('#'),
});

const createCarRequestSchema = z.object({
  name: z.string().min(1),
  color: z.string().startsWith('#'),
});

class Api {
  static BASE_URL = 'http://127.0.0.1:3000';

  static async createCar(data: z.infer<typeof createCarRequestSchema>) {
    try {
      const response = await fetch(`${this.BASE_URL}/garage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create car');
      }

      return createCarSchema.parse(await response.json());
    } catch (error) {
      console.error('Error in createCar:', error);
      throw error;
    }
  }

  static async deleteCar(id: number) {
    try {
      const response = await fetch(`${this.BASE_URL}/garage/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete car with id ${id}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in deleteCar:', error);
      throw error;
    }
  }
}

export { Api, createCarSchema, createCarRequestSchema };
