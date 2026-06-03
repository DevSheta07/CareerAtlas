const Student = require('../models/Student');
const Placement = require('../models/Placement');

// @desc    Get overall placement statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    // Total students count
    const totalStudents = await Student.countDocuments();

    // Placed students count
    const placedStudents = await Student.countDocuments({ status: 'placed' });

    // Placement percentage
    const placementPercentage =
      totalStudents > 0
        ? parseFloat(((placedStudents / totalStudents) * 100).toFixed(2))
        : 0;

    // Highest package from Placement collection
    const highestPackageResult = await Placement.aggregate([
      { $group: { _id: null, maxPackage: { $max: '$package' } } },
    ]);
    const highestPackage =
      highestPackageResult.length > 0 ? highestPackageResult[0].maxPackage : 0;

    // Average package from Placement collection
    const averagePackageResult = await Placement.aggregate([
      { $group: { _id: null, avgPackage: { $avg: '$package' } } },
    ]);
    const averagePackage =
      averagePackageResult.length > 0
        ? parseFloat(averagePackageResult[0].avgPackage.toFixed(2))
        : 0;

    // Higher studies count
    const higherStudiesCount = await Student.countDocuments({
      status: 'higher_studies',
    });

    // Recent placements (last 5)
    const recentPlacements = await Placement.find()
      .populate('studentId', 'name')
      .sort({ placementDate: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        placedStudents,
        placementPercentage,
        highestPackage,
        averagePackage,
        higherStudiesCount,
        higherStudies: higherStudiesCount,
        avgPackage: averagePackage,
        recentPlacements,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard stats',
      error: error.message,
    });
  }
};

// @desc    Get company-wise placement statistics
// @route   GET /api/dashboard/company-stats
// @access  Private
const getCompanyStats = async (req, res) => {
  try {
    const companyStats = await Placement.aggregate([
      {
        $group: {
          _id: '$company',
          count: { $sum: 1 },
          avgPackage: { $avg: '$package' },
        },
      },
      {
        $project: {
          _id: 0,
          company: '$_id',
          count: 1,
          avgPackage: { $round: ['$avgPackage', 2] },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: companyStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching company statistics',
      error: error.message,
    });
  }
};

// @desc    Get branch-wise placement statistics
// @route   GET /api/dashboard/branch-stats
// @access  Private
const getBranchStats = async (req, res) => {
  try {
    const branchStats = await Student.aggregate([
      {
        $group: {
          _id: '$branch',
          totalStudents: { $sum: 1 },
          placedStudents: {
            $sum: {
              $cond: [{ $eq: ['$status', 'placed'] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          branch: '$_id',
          totalStudents: 1,
          placedStudents: 1,
          count: '$totalStudents',
          placementPercentage: {
            $round: [
              {
                $multiply: [
                  { $divide: ['$placedStudents', '$totalStudents'] },
                  100,
                ],
              },
              2,
            ],
          },
        },
      },
      {
        $sort: { branch: 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: branchStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching branch statistics',
      error: error.message,
    });
  }
};

module.exports = {
  getStats,
  getCompanyStats,
  getBranchStats,
};
