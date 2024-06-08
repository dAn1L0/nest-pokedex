import { Injectable } from '@nestjs/common';
import type { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  // private readonly axios: AxiosInstance = axios
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}
  // constructor(
  //   private readonly pokemonService: PokemonService
  // ){}

  async executeSeed() {

    await this.pokemonModel.deleteMany({});

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')

    // const pokemonPromises = []
    const pokemonToInsert: { nro: number, name: string }[] = [];

    data.results.map(({ url, name }) => {
      const segments = url.split('/');
      const nro = +segments[segments.length - 2];
      pokemonToInsert.push({ nro, name });
      // pokemonPromises.push(this.pokemonModel.create({nro, name}));
      // console.log({ name, nro });
    })
    await this.pokemonModel.insertMany(pokemonToInsert);
    // await Promise.all(pokemonPromises);

    return `Seed executed :)`;
  }

}
