import { useState } from 'react'
import './App.css'

function App() {
  const [expenses, setExpenses] = useState([
    { id: 1, description: 'Groceries', amount: 150, category: 'Food', date: '2023-05-15' },
    { id: 2, description: 'Electric bill', amount: 80, category: 'Utilities', date: '2023-05-10' },
    { id: 3, description: 'Movie tickets', amount: 25, category: 'Entertainment', date: '2023-05-05' },
    { id: 4, description: 'Dinner out', amount: 60, category: 'Food', date: '2023-05-01' },
  ])

  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [date, setDate] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!description || !amount || !date) return

    const newExpense = {
      id: expenses.length + 1,
      description,
      amount: parseFloat(amount),
      category,
      date,
    }

    setExpenses([...expenses, newExpense])
    setDescription('')
    setAmount('')
    setCategory('Food')
    setDate('')
  }

  const handleDelete = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id))
  }

  const handleSort = (key) => {
    setSortBy(key)
  }

  const filteredExpenses = expenses
    .filter(expense => 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortBy) return 0
      if (a[sortBy] < b[sortBy]) return -1
      if (a[sortBy] > b[sortBy]) return 1
      return 0
    })

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="expense-tracker">
      <h1>Expense Tracker</h1>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search expenses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-group">
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Amount ($):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
            <option value="Housing">Housing</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <button type="submit">Add Expense</button>
      </form>

      <div className="expenses-table">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('description')}>Description {sortBy === 'description' && '↓'}</th>
              <th>Amount</th>
              <th onClick={() => handleSort('category')}>Category {sortBy === 'category' && '↓'}</th>
              <th onClick={() => handleSort('date')}>Date {sortBy === 'date' && '↓'}</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map(expense => (
              <tr key={expense.id}>
                <td>{expense.description}</td>
                <td>${expense.amount.toFixed(2)}</td>
                <td>{expense.category}</td>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td>
                  <button 
                    onClick={() => handleDelete(expense.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4">Total:</td>
              <td>${totalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default App