const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/users');
const Booking = require('../../models/booking');

const events = async eventIds => {
    try {
        const events = await Event.find({_id: {$in: eventIds}})
        return events.map(event => {
            return { 
                ...event._doc, 
                _id: event.id, 
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            }
        });
    } catch(err) {
        throw err;
    } 
}

const user = async userId => {
    try {
    const user = await User.findById(userId) 
         return { 
            ...user._doc, 
            _id: user.id,
            createdEvents: events.bind(this, user._doc.createdEvents)
        }; 
    } catch (err){
        throw err;
    }
}

module.exports = {
    events: async () => {
        try {
        const events = await Event.find()
            return events.map(event => {
                return { 
                    ...event._doc, 
                    _id: event.id, 
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator)
                };
            });
        } catch (err) {
            throw err;
        }
    },
    booking: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return { 
                    ...booking._doc,
                    _id: booking.id, 
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString()  
                    }
                });
        } catch (err) {
            throw err;
        }
    },
    createEvent: async args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '5eda0ed1178ee4f8f774d09f'
        });
        let createdEvent;
        try {
        const result = await event.save()
            createdEvent = { 
                ...result._doc, 
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, result._doc.creator) 
            };
            const creator = await User.findById('5eda0ed1178ee4f8f774d09f')
            if (!creator) {
                throw new Error('User not found.')
            }
            creator.createdEvents.push(event);
            await creator.save();
            return createdEvent;
        } catch (err) {
            throw err;
        }
    },
    createUser: async args => {
        try {
        const existingUser = await User.findOne({ email: args.userInput.email })
            if (existingUser) {
                throw new Error('User already exists!')
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            })
            const result = await user.save();
            return { ...result._doc, password: null };
        } catch(err) {
            throw err;
        };
    },
    bookEvent: async args => {
        const fetchedEvent = await Event.findOne({
            _id: args.eventId
        });
        const booking = new Booking ({
            user: '5eda0ed1178ee4f8f774d09f',
            event: fetchedEvent 
        });
        const result = await booking.save();
        return { 
            ...result._doc,
            _id: result.id,
            createdAt: new Date(result._doc.createdAt).toISOString(),
            updatedAt: new Date(result._doc.updatedAt).toISOString()  
        }
    }
};