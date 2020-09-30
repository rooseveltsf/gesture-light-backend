import faker from 'faker';
import { factory } from 'factory-girl';
import User from '../src/app/models/User';
import Publication from '../src/app/models/Publication';

factory.define('User', User, {
  name: faker.name.findName(),
  address: faker.address.city(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

factory.define('Publication', Publication, {
  title: faker.lorem.slug(8),
  description: faker.lorem.paragraph(),
  status: 'acessible',
  address: faker.address.city(),
  latitude: faker.address.latitude(),
  longitude: faker.address.longitude(),
});

export default factory;
