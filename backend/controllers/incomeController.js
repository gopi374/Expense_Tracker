import incomeModel from "../models/income.js";
import XLSX from "xlsx";
import getDateRange from "../utils/dataFilter.js";

export async function addIncome(req, res) {
  const userid = req.user.id;
  const { description, amount, category, date } = req.body;

  try {
    if (!description || !amount || !category || !date) {
      return res.status(404).json({
        success: false,
        message: "All fields required !",
      });
    }

    const newIncome = incomeModel({
      userid,
      description,
      amount,
      category,
      date: new Date(date),
    });
    await newIncome.save();
    res.json({
      success: true,
      message: "Income Added",
    });
  } catch (error) {
    console.log("Cannot Add Income ", error);
    res.status(500).json({
      success: false,
      message: "Internal server Error",
    });
  }
}

//to get sll income

export async function getAllincome(req, res) {
  const userid = req.user.id;

  try {
    const income = await incomeModel.find({ userid }).sort({ date: -1 });
    res.json(income);
  } catch (error) {
    console.log("Cannot get All Incomes ", error);
    res.status(500).json({
      suucess: false,
      message: "Internal server Error",
    });
  }
}


// Update income
export async function updateIncome(req, res) {
  const { id } = req.params;
  const userid = req.user.id;
  const { description, amount } = req.body;

  try {
    const updatedIncome = await incomeModel.findOneAndUpdate(
      {
        _id: id,
        userid,
      },
      {
        description,
        amount,
      },
      {
        returnDocument: "after",
      }
    );

    if (!updatedIncome) {
      return res.status(404).json({
        success: false,
        message: "Income Not Found!",
      });
    }

    return res.json({
      success: true,
      message: "Income Updated Successfully!",
      data: updatedIncome,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server Error",
    });
  }
}

//to delete income
export async function deleteIncome(req,res){
    try {
        const income = await incomeModel.findByIdAndDelete({_id:req.params.id});

        if(!income){
            return res.status(404).json({
                success:false,
                message:"Income Not found"
            })
        }

        return res.status(200).json({
            success:true,
            message:"Income deleted successfully!!"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
        suucess: false,
        message: "Internal server Error",
        });
    }
}


//to download data in sheets
export async function downnloadIncome(req,res){
    const userid =  req.user.id;

    try {
        const income = await incomeModel.find({userid}).sort({date:-1});
        const plaindata = income.map((inc)=>({
            Description :inc.description,
            Amount:inc.amount,
            Category:inc.category,
            Date: new Date(inc.date).toLocaleDateString(),
        }));
        const worksheet = XLSX.utils.json_to_sheet(plaindata);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook,worksheet, "incomeModel");
        XLSX.writeFile(workbook,"income_details.xlsx");
        res.download("income_details.xlsx");

    } catch (error) {
        console.log(error);
        res.status(500).json({
        suucess: false,
        message: "Internal server Error",
        });
    }
}


//to get income overview
export async function getIncomeOverview(req, res) {
  try {
    const userid = req.user.id;

    const { range = "monthly" } = req.body;

    const { start, end } = getDateRange(range);

    const incomes = await incomeModel
      .find({
        userid,
        date: {
          $gte: start,
          $lt: end,
        },
      })
      .sort({ date: -1 });

    const totalIncome = incomes.reduce(
      (acc, cur) => acc + cur.amount,
      0
    );

    const avgIncome =
      incomes.length > 0
        ? totalIncome / incomes.length
        : 0;

    const numberofTransactions = incomes.length;

    const recentTransactions = incomes.slice(0, 9);

    return res.json({
      success: true,
      data: {
        totalIncome,
        avgIncome,
        numberofTransactions,
        recentTransactions,
        range,
      },
    });
  } catch (error) {
    console.log("Income Overview Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server Error",
    });
  }
}