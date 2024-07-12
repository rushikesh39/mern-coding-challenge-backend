const ProductTransaction = require('../models/ProductTransaction');

exports.getStatistics = async (req, res) => {
    const { month } = req.query;
    console.log("month",month)

    const start = new Date(`2022-${month}-01`);
    // const end = new Date(`${month}-01`).setMonth(start.getMonth() + 1);
     const end = new Date(start);
        end.setMonth(end.getMonth() + 1);

    const totalSales = await ProductTransaction.aggregate([
        { $match: { dateOfSale: { $gte: start, $lt: end }, sold: true } },
        { $group: { _id: null, totalAmount: { $sum: '$price' }, totalItems: { $sum: 1 } } }
    ]);

    const unsoldItems = await ProductTransaction.countDocuments({ dateOfSale: { $gte: start, $lt: end }, sold: false });

    res.json({
        totalSales: totalSales[0] ? totalSales[0].totalAmount : 0,
        totalSoldItems: totalSales[0] ? totalSales[0].totalItems : 0,
        totalUnsoldItems: unsoldItems
    });
};
