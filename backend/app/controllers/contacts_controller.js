import errorHandler from '#exceptions/error_handler';
import { Exception } from '@adonisjs/core/exceptions';
import User from '#models/user';
import Contact from '#models/contact';
export default class ContactsController {
    async index(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { page, limit, ...input } = request.qs();
            const dataQuery = Contact.filter(input)
                .where('userId', auth.user.id)
                .preload('contact', (query) => {
                query.preload('customer');
            })
                .orderBy('id', 'desc');
            const data = page && limit ? await dataQuery.paginate(page, limit) : await dataQuery.exec();
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async getQuickSendContacts(ctx) {
        const { auth, response } = ctx;
        try {
            const data = await Contact.query()
                .where('userId', auth.user.id)
                .andWhere('quickSend', true)
                .preload('contact', (query) => {
                query.preload('customer');
            });
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async getById(ctx) {
        const { request, response } = ctx;
        try {
            const contactId = request.param('id');
            const data = await Contact.query()
                .where('id', contactId)
                .preload('contact', (query) => {
                query.preload('customer');
            })
                .first();
            if (!data) {
                return response.notFound({ success: false, message: 'Contact data not found' });
            }
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Get By Id Error');
        }
    }
    async addContact(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { contactId } = request.only(['contactId']);
            const contact = await User.findBy({
                id: Number.parseInt(contactId),
            });
            if (!contact) {
                return response.notFound({ success: false, message: 'User not found' });
            }
            if (auth.user.id === contactId) {
                return response.badRequest({ success: false, message: "User can't be his own contact" });
            }
            const exist = await Contact.findBy({
                userId: auth.user.id,
                contactId: contactId,
            });
            if (exist) {
                throw new Exception('Contact already exist', { status: 208 });
            }
            await Contact.create({ userId: auth.user.id, contactId });
            return response.created({ success: true, message: 'New contact created successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Update Error');
        }
    }
    async addToQuickSend(ctx) {
        const { auth, request, response } = ctx;
        try {
            const id = request.param('id');
            const contact = await Contact.find(id);
            if (!contact) {
                return response.notFound({ success: false, message: 'Contact data not found' });
            }
            const data = await Contact.query().where({ userId: auth.user.id, quickSend: true });
            if (data.length >= 5) {
                return response.badRequest({ success: false, message: "Can't add more than 5 contacts." });
            }
            contact.quickSend = true;
            await contact.save();
            return response.created({
                success: true,
                message: 'Contact has added to the quick send successfully',
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Add to quick send Error');
        }
    }
    async removeFromQuickSend(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const contact = await Contact.find(id);
            if (!contact) {
                return response.notFound({ success: false, message: 'Contact data not found' });
            }
            contact.quickSend = false;
            await contact.save();
            return response.created({
                success: true,
                message: 'Contact has removed from the quick send successfully',
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Remove from quick send Error');
        }
    }
    async deleteContact(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const contact = await Contact.find(id);
            if (!contact) {
                return response.notFound({ success: false, message: 'Contact data not found' });
            }
            await contact.delete();
            return response.created({ success: true, message: 'Contact deleted successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Update Error');
        }
    }
}
//# sourceMappingURL=contacts_controller.js.map