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

const deleteCarSchema = z.object({
  id: z.number(),
});

const getAllCarsSchema = z.array(createCarSchema);

const updateCarSchema = z.object({
  id: z.number(),
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

  static async deleteCar(id: z.infer<typeof deleteCarSchema>) {
    try {
      const response = await fetch(`${this.BASE_URL}/garage/${id.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete car with id ${id.id}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in deleteCar:', error);
      throw error;
    }
  }

  static async getAllCars(limit?: number, page?: number) {
    try {
      let url = `${this.BASE_URL}/garage?`;
      if (limit) {
        url += `_limit=${limit}`;
      }
      if (page) {
        url += `&_page=${page}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to get all cars');
      }

      const totalCount = response.headers.get('X-Total-Count');
      const cars = await getAllCarsSchema.parse(await response.json());

      return { cars, totalCount };
    } catch (error) {
      console.error('Error in getAllCars:', error);
      throw error;
    }
  }

  static async updateCar(data: z.infer<typeof updateCarSchema>) {
    try {
      const response = await fetch(`${this.BASE_URL}/garage/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return updateCarSchema.parse(await response.json());
    } catch (error) {
      console.error('Error in updateCar:', error);
      throw error;
    }
  }

  static async getAllCarIds() {
    try {
      const response = await fetch(`${this.BASE_URL}/garage`);

      if (!response.ok) {
        throw new Error('Failed to get car IDs');
      }

      const cars = await response.json();
      const carIds = cars.map((car: { id: number }) => car.id);

      return carIds;
    } catch (error) {
      console.error('Error in getAllCarIds:', error);
      throw error;
    }
  }

  static async deleteAllCars() {
    try {
      const carIds = await this.getAllCarIds();
      await Promise.all(
        carIds.map(async (id: number) => {
          await this.deleteCar({ id });
        }),
      );
      console.log('All cars deleted successfully');
    } catch (error) {
      console.error('Error deleting cars:', error);
      throw error;
    }
  }

  static async controlEngine(id: number, status: 'started' | 'stopped', signal?: AbortSignal) {
    try {
      const response = await fetch(`${this.BASE_URL}/engine?id=${id}&status=${status}`, {
        method: 'PATCH',
        signal,
      });

      if (!response.ok) {
        throw new Error(`Failed to control engine for car with id ${id}`);
      }

      return await response.json();
    } catch (cause) {
      if (cause instanceof DOMException) return null;
      console.error('Error in controlEngine:', cause);
      throw cause;
    }
  }

  static async switchToDriveMode(id: number, signal: AbortSignal) {
    try {
      const response = await fetch(`${this.BASE_URL}/engine?id=${id}&status=drive`, {
        method: 'PATCH',
        signal,
      });

      if (!response.ok) {
        throw new Error(`Fetch failed`);
      }

      return await response.json();
    } catch (cause) {
      if (cause instanceof DOMException) return null;
      const error = new Error(`Failed to switch to drive mode for car with id ${id}`, { cause });
      console.error(error);
      throw error;
    }
  }

  static async createWinner(id: number, time: number) {
    try {
      const response = await fetch(`${this.BASE_URL}/winners`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          wins: 1,
          time,
        }),
      });

      if (!response.ok) {
        throw new Error(`Fetch failed`);
      }

      return await response.json();
    } catch (cause) {
      const error = new Error(`Failed to create winner for car with id ${id} with time ${time}`, {
        cause,
      });
      console.error(error);
      throw error;
    }
  }

  static async getWinner(id: number) {
    try {
      const response = await fetch(`${this.BASE_URL}/winners/${id}`);

      if (!response.ok) {
        throw new Error(`Fetch failed`);
      }

      return await response.json();
    } catch (cause) {
      const error = new Error(`Failed to get winner for car with id ${id}`, {
        cause,
      });
      console.error(error);
      throw error;
    }
  }

  static async updateWinner(id: number, wins: number, time: number) {
    try {
      const response = await fetch(`${this.BASE_URL}/winners/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wins,
          time,
        }),
      });

      if (!response.ok) {
        throw new Error(`Fetch failed`);
      }

      return await response.json();
    } catch (cause) {
      const error = new Error(`Failed to update winner for car with id ${id} with time ${time}`, {
        cause,
      });
      console.error(error);
      throw error;
    }
  }

  static async deleteWinner(id: number) {
    try {
      const response = await fetch(`${this.BASE_URL}/winners/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Fetch failed`);
      }

      return await response.json();
    } catch (cause) {
      const error = new Error(`Failed to delete winner for car with id ${id}`, {
        cause,
      });
      console.error(error);
      throw error;
    }
  }

  static async getWinners() {
    try {
      const response = await fetch(`${this.BASE_URL}/winners`);

      if (!response.ok) {
        throw new Error(`Fetch failed`);
      }

      return await response.json();
    } catch (cause) {
      const error = new Error(`Failed to get winners`, { cause });
      console.error(error);
      throw error;
    }
  }
}

export { Api, createCarSchema, createCarRequestSchema };
