'use strict';

/**
 * Account.js controller
 *
 * @description: A set of functions called "actions" for managing `Account`.
 */

module.exports = {

  /**
   * Retrieve account records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    return strapi.services.account.fetchAll(ctx.query);
  },

  /**
   * Retrieve a account record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.account.fetch(ctx.params);
  },

  /**
   * Send balance to specific account.
   *
   * @return {Number}
   */

  send: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    if (!ctx.params.reveiverId.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    if (!ctx.params.amount.match(/^[0-9]+$/)) {
      return ctx.notFound();
    }

    return strapi.services.account.send({
      fromId: ctx.params._id,
      toId: ctx.params.reveiverId,
      amount: parseInt(ctx.params.amount)
    }, ctx.request.body);
  },

  /**
   * Count account records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.account.count(ctx.query);
  },

  /**
   * Create a/an account record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.account.add(ctx.params);
  },

  /**
   * Create a/an account record.
   *
   * @return {Object}
   */

  new: async (ctx) => {
    if (!ctx.params.user) {
      return ctx.notFound();
    }

    ctx.params.balance = 100;

    return strapi.services.account.add(ctx.params);
  },

  /**
   * Update a/an account record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.account.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an account record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.account.remove(ctx.params);
  }
};
