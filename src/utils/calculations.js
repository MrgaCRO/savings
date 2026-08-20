export function calculateTimeline(currentSavings, monthlySavings, goals) {
  // Sort goals by priority (1 is High, 2 is Medium, 3 is Low) and then by creation date.
  const sortedGoals = [...goals].sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.addedAt - b.addedAt;
  });

  let balance = Number(currentSavings) || 0;
  const monthly = Number(monthlySavings) || 0;
  
  let monthsPassed = 0;
  
  const results = [];

  for (let goal of sortedGoals) {
    const cost = Number(goal.cost);
    
    if (balance >= cost) {
      balance -= cost;
      results.push({
        ...goal,
        monthsToSave: 0,
        totalMonths: monthsPassed, // when they actually get it
        affordableNow: true,
      });
    } else {
      let needed = cost - balance;
      if (monthly <= 0) {
        results.push({
          ...goal,
          monthsToSave: Infinity,
          totalMonths: Infinity,
          affordableNow: false,
        });
        continue;
      }
      
      let months = Math.ceil(needed / monthly);
      monthsPassed += months;
      // Update balance with what was saved minus the cost of the item
      balance = balance + (months * monthly) - cost;
      
      results.push({
        ...goal,
        monthsToSave: months,
        totalMonths: monthsPassed,
        affordableNow: false,
      });
    }
  }

  // Find "Buy Now" opportunities for lower priority items that can be bought right now.
  const buyNowOpportunities = [];
  const initialBalance = Number(currentSavings) || 0;
  
  for (let goal of goals) {
    if (initialBalance >= Number(goal.cost)) {
      const normalResult = results.find(r => r.id === goal.id);
      // If normally they have to wait because they are saving for a higher priority item first
      if (normalResult && normalResult.totalMonths > 0) {
         buyNowOpportunities.push(goal.id);
      }
    }
  }

  // Sort results back by totalMonths so it's a timeline
  results.sort((a, b) => a.totalMonths - b.totalMonths);

  return { results, buyNowOpportunities };
}
