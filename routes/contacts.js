const express = require('express'); // Import express in each file so we can use the router
const router = express.Router();
const {check, validationResult} = require('express-validator');
const auth = require('../middleware/auth')

const User = require('../models/User');
const Contact = require('../models/Contact');

// @route   GET api/contacts
// @desc    Get all users' contacts
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const contacts = await Contact.find({
            user: req.user.id
        }).sort({date: -1}); // Sort dates from most to least recent
        res.json(contacts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
});

// @route   GET api/contacts
// @desc    Add new contact
// @access  Private
router.post('/', [auth, [
    check('name', 'Name is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // If we have errors
        return res.status(400).json({errors: errors.array()}); // Return 'errors' in array format
    }

    const {name, email, phone, type} = req.body;

    try {
        const newContact = new Contact({
            name, email, phone, type, user: req.user.id
        });

        const contact = await newContact.save();

        res.json(contact);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/contacts/:id
// @desc    Update contact
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const {name, email, phone, type} = req.body;
    
    //Build contact object
    const contactFields = {};
    if (name) contactFields.name = name;
    if (email) contactFields.email = email;
    if (phone) contactFields.phone = phone;
    if (type) contactFields.type = type;

    try {
        let contact = await Contact.findById(req.params.id);

        if (!contact) return res.status(404).json({message: 'Contact not found'});

        // Make sure the user owns the contact
        if (contact.user.toString() !== req.user.id) {
            return res.status(401).json({message: 'Not authorized'});
        }

        // Update the contact
        contact = await Contact.findByIdAndUpdate(req.params.id, 
            {$set: contactFields},
            {new: true}
            );

            res.json(contact);
    } catch {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// @route   DELETE api/contacts/:id
// @desc    Delete contact
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let contact = await Contact.findById(req.params.id);

        if (!contact) return res.status(404).json({message: 'Contact not found'});

        // Make sure the user owns the contact
        if (contact.user.toString() !== req.user.id) {
            return res.status(401).json({message: 'Not authorized'});
        }

        // Delete the contact
        await Contact.findByIdAndRemove(req.params.id);

            res.json({message: 'Contact Removed'});
    } catch {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// Must do this or the route won't work
module.exports = router; 