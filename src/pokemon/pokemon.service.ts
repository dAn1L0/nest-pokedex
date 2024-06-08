import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private readonly defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly configService: ConfigService

  ) {
    this.defaultLimit = configService.get<number>('defaultLimit')
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto)
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;
    return this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({ nro: 1 })
      .select('-__v');
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    if( !isNaN(+term) ){
      pokemon = await this.pokemonModel.findOne({ nro: term });
    }
    // mongoId
    if ( !pokemon && isValidObjectId(term) ) {
      pokemon = await this.pokemonModel.findById(term);
    }
    // name
    if ( !pokemon && term.length > 1 ){
      pokemon = await this.pokemonModel.findOne({ name: term.trim().toLowerCase() });
    }

    if ( !pokemon ) {
      throw new NotFoundException(`Pokemon with id, name or nro "${term}" not found.`);
    }

    return pokemon;

  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    if ( updatePokemonDto.name ){
      updatePokemonDto.name = updatePokemonDto.name.trim().toLowerCase();
    }
    try {
      const pokemon = await this.findOne( term );
      await pokemon.updateOne( updatePokemonDto );
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    }
    catch (error) {
      this.handleExceptions(error);
    }

  }

  async remove(id: string):Promise<any> {
    // const pokemon = await this.findOne( term );
    // await pokemon.deleteOne();
    // return {id}
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id })
    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with MongoId "${id}" not found`);
    }
    return;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`)
    }
    console.log(error);
    throw new InternalServerErrorException(`Error creating pokemon - Check server logs.`)
  }
}
