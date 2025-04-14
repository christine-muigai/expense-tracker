import { useState } from 'react'
import styles from './App.module.css';

function App() {
  const [expenses, setExpenses] = useState([
    { id: 1, description: 'Groceries', amount: 150, category: 'Food', date: '2023-05-15' },
    { id: 2, description: 'Electric bill', amount: 80, category: 'Utilities', date: '2023-05-10' },
    { id: 3, description: 'Movie tickets', amount: 25, category: 'Entertainment', date: '2023-05-05' },
    { id: 4, description: 'Dinner out', amount: 60, category: 'Food', date: '2023-05-01' },
  ])

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Food',
    date: ''
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.description || !formData.amount || !formData.date) return

    const newExpense = {
      id: Date.now(),
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date
    }

    setExpenses(prev => [...prev, newExpense])
    setFormData({
      description: '',
      amount: '',
      category: 'Food',
      date: ''
    })
  }

  const handleDelete = (id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id))
  }

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const filteredExpenses = expenses.filter(expense => 
    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (!sortConfig.key) return 0
    
    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1
    }
    return 0
  })

  const totalAmount = sortedExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className={styles.expenseTracker}>
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
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Amount ($):</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
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
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit">Add Expense</button>
      </form>

      <div className="expenses-table">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('description')}>
                Description {sortConfig.key === 'description' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Amount</th>
              <th onClick={() => handleSort('category')}>
                Category {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('date')}>
                Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedExpenses.map(expense => (
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