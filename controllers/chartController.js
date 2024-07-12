const ProductTransaction = require('../models/ProductTransaction');

exports.getBarChartData = async (req, res) => {
    const { month } = req.query;

    const start = new Date(`2022-${month}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const ranges = [
        { range: '0-100', min: 0, max: 100 },
        { range: '101-200', min: 101, max: 200 },
        { range: '201-300', min: 201, max: 300 },
        { range: '301-400', min: 301, max: 400 },
        { range: '401-500', min: 401, max: 500 },
        { range: '501-600', min: 501, max: 600 },
        { range: '601-700', min: 601, max: 700 },
        { range: '701-800', min: 701, max: 800 },
        { range: '801-900', min: 801, max: 900 },
        { range: '901-above', min: 901, max: Infinity }
    ];

    const barChartData = await Promise.all(ranges.map(async range => {
        const count = await ProductTransaction.countDocuments({ price: { $gte: range.min, $lt: range.max }, dateOfSale: { $gte: start, $lt: end } });
        return { name: range.range, uv: count };
    }));

    res.json(barChartData);
};




exports.getPieChartData = async (req, res) => {
    const { month } = req.query;

    if (!month) {
        return res.status(400).json({ error: 'Month parameter is required' });
    }

    const start = new Date(`2022-${month}-01`);
    if (isNaN(start.getTime())) {
        return res.status(400).json({ error: 'Invalid month format' });
    }

    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    try {
        const pieChartData = await ProductTransaction.aggregate([
            {
                $match: {
                    dateOfSale: {
                        $gte: start,
                        $lt: end
                    }
                }
            },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: '$_id',
                    count: 1
                }
            }
        ]);

        res.json(pieChartData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
