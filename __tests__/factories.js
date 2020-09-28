import faker from 'faker';
import { factory } from 'factory-girl';
import User from '../src/app/models/User';

factory.define('User', User, {
  name: faker.name.findName(),
  address: faker.address.city(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

factory.define('Session', User, {
  email: faker.internet.email(),
  password: faker.internet.password(),
});

export default factory;
