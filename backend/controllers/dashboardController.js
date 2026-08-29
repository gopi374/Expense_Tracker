import expenseModel from "../models/expense.js";
import incomeModel from "../models/income.js";

export async function getDashboardOverview(req, res) {
  const userid = req.user.id;

  const now = new Date();

  const startofMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  try {
    const incomes = await incomeModel.find({
      userid,
      date: { $gte: startofMonth,$lte: now},
    }).lean();

    const expenses = await expenseModel.find({
      userid,
      date: { $gte: startofMonth,$lte: now},
    }).lean();

    const monthlyIncome = incomes.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
    const monthlyExpense = expenses.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
    const savings = monthlyIncome - monthlyExpense;
    const savingsRate = monthlyIncome === 0 ? 0 : Math.round((savings / monthlyIncome) * 100);

    const recentTransactions = [
      ...incomes.map((i) => ({ ...i, type: "income" })),
      ...expenses.map((e) => ({ ...e, type: "expense" })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const spendByCategory = {};
    for (const exp of expenses) {
      const cat = exp.category || "Other";
      spendByCategory[cat] = (spendByCategory[cat] || 0) + Number(exp.amount || 0);
    }

    const expenseDistribution = Object.entries(spendByCategory).map(([category, amount]) => ({
      category,
      amount,
      percent: monthlyExpense === 0 ? 0 : Math.round((amount / monthlyExpense) * 100),
    })); //for chart

    res.json({
        success:true,
        message:"ALl dashBoard data !",
        date:{
            monthlyIncome,
            monthlyExpense,
            savings,
            savingsRate,
            recentTransactions,
            spendByCategory,
            expenseDistribution
        }
    })
  } 
  catch (error) {
    console.error("GetDashBoard Error",error);
    return res.status(500).json({
        success:false,
        message:"Dashboard fetch Failed"
    });
  }
}
