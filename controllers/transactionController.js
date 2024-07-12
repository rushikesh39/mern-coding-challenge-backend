const ProductTransaction = require('../models/ProductTransaction');

exports.listTransactions = async (req, res) => {
    try {
        const { page = 1, perPage = 10, search = '', month } = req.query;
        console.log("month in transaction Control",month)
        if (!month) {
            return res.status(400).json({ error: 'Month parameter is required' });
        }

        const start = new Date(`2022-${month}-01`);
        if (isNaN(start.getTime())) {
            return res.status(400).json({ error: 'Invalid month format' });
        }

        const end = new Date(start);
        end.setMonth(end.getMonth() + 1);

        const filter = {
            dateOfSale: {
                $gte: start,
                $lt: end
            }
        };

        if (search) {
            // Convert search to integer if possible
            const parsedSearch = parseInt(search);
            if (!isNaN(parsedSearch)) {
                filter.price = {
                    $gte: parsedSearch,           // Greater than or equal to parsedSearch
                    $lt: parsedSearch + 10     // Less than parsedSearch + 10 (adjust range as needed)
                };
            } else {
                const regexSearch = { $regex: search, $options: 'i' };
                filter.$or = [
                    { title: regexSearch },
                    { description: regexSearch }
                ];
            }
        }

        // Console log for debugging
        console.log('Filter:', filter);

        const totalCount = await ProductTransaction.countDocuments(filter);
        const transactions = await ProductTransaction.find(filter)
            .skip((page - 1) * perPage)
            .limit(Number(perPage));

        res.json({
            transactions,
            totalPages: Math.ceil(totalCount / perPage),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
