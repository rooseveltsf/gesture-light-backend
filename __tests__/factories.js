import faker from 'faker';
import { factory } from 'factory-girl';
import User from '../src/app/models/User';

factory.define('User', User, {
  name: faker.name.findName(),
  endereco: faker.address.city(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

export default factory;
