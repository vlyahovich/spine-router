import _ from 'lodash';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiSinon from 'sinon-chai';

chai.use(chaiAsPromised);
chai.use(chaiSinon);

var context = require.context('./src', true, /.spec\.js$/);
context.keys().forEach(context);
