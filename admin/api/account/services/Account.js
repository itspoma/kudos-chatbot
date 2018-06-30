'use strict';

/**
 * Account.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// Public dependencies.
const _ = require('lodash');

module.exports = {

  /**
   * Promise to fetch all accounts.
   *
   * @return {Promise}
   */

  fetchAll: (params) => {
    // Convert `params` object to filters compatible with Mongo.
    const filters = strapi.utils.models.convertParams('account', params);
    // Select field to populate.
    const populate = Account.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)
      .join(' ');

    return Account
      .find()
      .where(filters.where)
      .sort(filters.sort)
      .skip(filters.start)
      .limit(filters.limit)
      .populate(populate);
  },

  /**
   * Promise to fetch a/an account.
   *
   * @return {Promise}
   */

  fetch: (params) => {
    // Select field to populate.
    const populate = Account.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)
      .join(' ');

    return Account
      .findOne(_.pick(params, _.keys(Account.schema.paths)))
      .populate(populate);
  },

  /**
   * Promise to count accounts.
   *
   * @return {Promise}
   */

  count: (params) => {
    // Convert `params` object to filters compatible with Mongo.
    const filters = strapi.utils.models.convertParams('account', params);

    return Account
      .count()
      .where(filters.where);
  },

  /**
   * Promise to add a/an account.
   *
   * @return {Promise}
   */

  add: async (values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Account.associations.map(ast => ast.alias));
    const data = _.omit(values, Account.associations.map(ast => ast.alias));

    // Create entry with no-relational data.
    const entry = await Account.create(data);

    // Create relational data and return the entry.
    return Account.updateRelations({ id: entry.id, values: relations });
  },

  /**
   * Promise to update a/an account.
   *
   * @return {Promise}
   */

  bonus: async (params) => {
    const entry = await Account.update({}, {
      $inc: {"balance": 100}
    }, { multi: true });

    return Account.count();
  },

  /**
   * Promise to edit a/an account.
   *
   * @return {Promise}
   */

  edit: async (params, values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Account.associations.map(a => a.alias));
    const data = _.omit(values, Account.associations.map(a => a.alias));

    // Update entry with no-relational data.
    const entry = await Account.update(params, data, { multi: true });

    // Update relational data and return the entry.
    return Account.updateRelations(Object.assign(params, { values: relations }));
  },

  /**
   * Promise to remove a/an account.
   *
   * @return {Promise}
   */

  remove: async params => {
    // Select field to populate.
    const populate = Account.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)
      .join(' ');

    // Note: To get the full response of Mongo, use the `remove()` method
    // or add spent the parameter `{ passRawResult: true }` as second argument.
    const data = await Account
      .findOneAndRemove(params, {})
      .populate(populate);

    if (!data) {
      return data;
    }

    await Promise.all(
      Account.associations.map(async association => {
        const search = _.endsWith(association.nature, 'One') || association.nature === 'oneToMany' ? { [association.via]: data._id } : { [association.via]: { $in: [data._id] } };
        const update = _.endsWith(association.nature, 'One') || association.nature === 'oneToMany' ? { [association.via]: null } : { $pull: { [association.via]: data._id } };

        // Retrieve model.
        const model = association.plugin ?
          strapi.plugins[association.plugin].models[association.model || association.collection] :
          strapi.models[association.model || association.collection];

        return model.update(search, update, { multi: true });
      })
    );

    return data;
  },

  /**
   * Promise to edit a/an account.
   *
   * @return {Promise}
   */

  send: async (params, values) => {
    // Update entry with no-relational data.
    const fromEntry = await Account.updateOne({_id: params.fromId}, {
      $inc: {"balance": -params.amount}
    }, { multi: true });

    const toEntry = await Account.updateOne({_id: params.toId}, {
      $inc: {"balance": +params.amount}
    }, { multi: true });

    // Update relational data and return the entry.
    return Account.findOne({_id: params.fromId})
  },
};
