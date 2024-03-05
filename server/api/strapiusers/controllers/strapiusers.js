'use strict';

const crypto = require('crypto');
const _ = require('lodash');
const grant = require('grant-koa');
const { sanitizeEntity } = require('strapi-utils');


module.exports = {


    async findSuperAdmins() {
        try {
        // Find the role representing super admins
        const superAdminRole = await strapi
            .query('role', 'admin')
            .findOne({ code: 'strapi-super-admin' });
    
        if (!superAdminRole) {
            console.error('Super admin role not found');
            return [];
        }
        //console.log('Role name: ', superAdminRole);
        // Find users assigned the super admin role
        const superAdmins = await strapi
            .query('user', 'admin',)
            .find();
    
        return superAdmins;
        } catch (error) {
        console.error('Error finding super admins:', error);
        return [];
        }
    }
}