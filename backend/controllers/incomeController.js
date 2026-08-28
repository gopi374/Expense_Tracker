import incomeModel from "../models/income";
import XLSX from "xlsx";
import getDateRange from "../utils/dataFilter";

export async function addIncome(req, res) {
  const userid = req.user._id;
  const { description, amount, category, date } = req.body;

  try {
    if (!description || !amount || !category || !date) {
      return res.status(404).json({
        success: false,
        message: "All feilds required !",
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
      suucess: false,
      message: "Internal server Error",
    });
  }
}

//to get sll income

export async function getAllincome(req, res) {
  const userid = req.user._id;

  try {
    const income = await incomeModel.find({ userid }).sort({ date: -1 });
    res.json(income);
  } catch (error) {
    console.log("Cannot Add Income ", error);
    res.status(500).json({
      suucess: false,
      message: "Internal server Error",
    });
  }
}

//update income
export async function updateIncome(req, res) {
  const { id } = req.params;
  const userid = req.user._id;
  const { description, amount } = req.body;

  try {
    const updatedIncome = await incomeModel.findOneAndUpdate(
      {
        _id: id,
        userid,
      },
      { description, amount },
      { new: true },
    );
    if(!updateIncome){
        return res.status(404).json({
            success:false,
            message:"Income NOt Found !"
        })
    }

    res.json({
        success:true,
        message:"Income updated SuccessFully !",
        data:updateIncome
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      suucess: false,
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
    const userid =  req.user._id;

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


//