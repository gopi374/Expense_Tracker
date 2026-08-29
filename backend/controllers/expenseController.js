import expenseModel from "../models/expense.js";
import XLSX from "xlsx";
import getDateRange from "../utils/dataFilter.js";

export async function addExpense(req,res){
    const userid = req.user.id;
    const { description, amount, category, date } = req.body;

    try {
        if (!description || !amount || !category || !date) {
        return res.status(404).json({
            success: false,
            message: "All fields required !",
        });
        }

        const newexpense = expenseModel(
            {
                userid,
                description,
                amount,
                category,
                date: new Date(date)
            }
        )
        await newexpense.save();
        res.json({
        success: true,
        message: "Expense Added successfully",
        });
        
    }
    catch(error){
        console.log("Cannot Add Expense ", error);
        res.status(500).json({
        success: false,
        message: "Internal server Error",
        });
    }
}

//get all Expenses
export async function getAllexpense(req, res) {
  const userid = req.user.id;

  try {
    const expense = await expenseModel.find({ userid }).sort({ date: -1 });
    res.json(expense);
  } catch (error) {
    console.log("Cannot get all Expense ", error);
    res.status(500).json({
      suucess: false,
      message: "Internal server Error",
    });
  }
}


// Update Expense
export async function updateExpense(req, res) {
  const { id } = req.params;
  const userid = req.user.id;
  const { description, amount } = req.body;

  try {
    const updatedExpense = await expenseModel.findOneAndUpdate(
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

    if (!updatedExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense Not Found!",
      });
    }

    return res.json({
      success: true,
      message: "Expense Updated Successfully!",
      data: updatedExpense,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server Error",
    });
  }
}

//to delete Expense
export async function deleteExpense(req,res){
    try {
        const Expense = await expenseModel.findByIdAndDelete({_id:req.params.id});

        if(!Expense){
            return res.status(404).json({
                success:false,
                message:"Expense Not found"
            })
        }

        return res.status(200).json({
            success:true,
            message:"Expense deleted successfully!!"
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
export async function downnloadExpense(req,res){
    const userid =  req.user.id;

    try {
        const expense = await expenseModel.find({userid}).sort({date:-1});
        const plaindata = expense.map((inc)=>({
            Description :inc.description,
            Amount:inc.amount,
            Category:inc.category,
            Date: new Date(inc.date).toLocaleDateString(),
        }));
        const worksheet = XLSX.utils.json_to_sheet(plaindata);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook,worksheet, "expenseModel");
        XLSX.writeFile(workbook,"expense_details.xlsx");
        res.download("expense_details.xlsx");

    } catch (error) {
        console.log(error);
        res.status(500).json({
        suucess: false,
        message: "Internal server Error",
        });
    }
}


// Get expense overview
export async function getExpenseOverview(req, res) {
  try {
    const userid = req.user.id;

    const { range = "monthly" } = req.query;

    const { start, end } = getDateRange(range);

    console.log("USER ID:", userid);
    console.log("RANGE:", range);
    console.log("START:", start);
    console.log("END:", end);

    const expenses = await expenseModel
      .find({
        userid,
        date: {
          $gte: start,
          $lt: end,
        },
      })
      .sort({ date: -1 });

    const totalexpense = expenses.reduce(
      (acc, cur) => acc + cur.amount,
      0
    );

    const avgexpense =
      expenses.length > 0
        ? totalexpense / expenses.length
        : 0;

    const numberofTransactions = expenses.length;

    const recentTransactions = expenses.slice(0, 9);

    return res.json({
      success: true,
      message: "These are Expenses",
      data: {
        totalexpense,
        avgexpense,
        numberofTransactions,
        recentTransactions,
        range,
      },
    });
  } catch (error) {
    console.log("Expense Overview Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server Error",
    });
  }
}