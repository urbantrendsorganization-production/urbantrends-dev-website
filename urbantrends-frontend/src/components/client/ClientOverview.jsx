import axios from 'axios';
import { DollarSign, FolderKanban, Package } from 'lucide-react';
import React, { useEffect, useState } from 'react'

function ClientOverview() {
    const [projects, setProjects] = useState([]);
    const [orders, setOrders] = useState([])
    const email = localStorage.getItem("userEmail")
    const [recentOrders, setRecentOrders] = useState([])


    useEffect(() => {

    
    // Fetch projects
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`https://urbantrends-backend-production-fde8.up.railway.app/dev/projects-access/${email}`);
        setProjects(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    // Fetch orders
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`https://urbantrends-backend-production-fde8.up.railway.app/products/prods-order/${email}`);
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error(err);
      }
    };

    // Fetch support tickets
    // const fetchTickets = async () => {
    //   try {
    //     const res = await axios.get(`https://urbantrends-backend-production-fde8.up.railway.app/api/tickets/${email}`);
    //     setSupportTickets(res.data.tickets || []);
    //   } catch (err) {
    //     console.error(err);
    //   }
    // };

    fetchOrders();
    fetchProjects()
  }, [email]);


  const stats = [
    {
      label: 'Active Projects',
      value: projects.length,
      change: projects.length > 0 ? `+${projects.length} this month` : '0',
      icon: FolderKanban,
      trend: projects.length > 0 ? 'up' : 'neutral',
    },
    {
      label: 'Total Spent',
      value: `$${orders.reduce((sum, o) => sum + o.amount, 0).toLocaleString()}`,
      change: '+12% from last month',
      icon: DollarSign,
      trend: 'up',
    },
    {
      label: 'Active Orders',
      value: orders.length,
      change: `${orders.filter(o => o.status === 'pending').length} pending delivery`,
      icon: Package,
      trend: 'neutral',
    },
  ];




  const spendingData = orders.reduce((acc, order) => {
    const month = new Date(order.createdAt).toLocaleString('default', { month: 'short' });
    const existing = acc.find(d => d.month === month);
    if (existing) {
      existing.amount += order.amount;
    } else {
      acc.push({ month, amount: order.amount });
    }
    return acc;
  }, []);

  const projectActivityData = projects.map((p, index) => ({
    week: `Week ${index + 1}`,
    hours: 0, // replace with real field if available
  }));




  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
      case 'paid':
        return 'bg-silver/20 text-silver border-silver/30';
      case 'in progress':
      case 'processing':
        return 'bg-dim-grey/20 text-dim-grey border-dim-grey/30';
      case 'pending':
        return 'bg-gunmetal/20 text-dim-grey border-dim-grey/30';
      default:
        return 'bg-gunmetal/20 text-dim-grey border-dim-grey/30';
    }
  };
  return (
    <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="bg-gunmetal/20 border-dim-grey/30 p-6 hover:border-silver/30 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      {/* Icon */}
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-silver to-dim-grey flex items-center justify-center">
                        <stat.icon className="w-6 h-6 text-black" />
                      </div>

                      {/* Trend arrow */}
                      {stat.trend === 'up' && <TrendingUp className="w-4 h-4 text-silver" />}
                      {stat.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                      {stat.trend === 'neutral' && <TrendingUpDown className="w-4 h-4 text-dim-grey" />}
                    </div>

                    {/* Stat values */}
                    <div className="text-2xl text-silver mb-1">{stat.value}</div>
                    <div className="text-sm text-dim-grey mb-2">{stat.label}</div>
                    <div className="text-xs text-dim-grey">{stat.change}</div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <br />

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <Card className="bg-gunmetal/20 border-dim-grey/30 p-6">
                  <h3 className="text-silver mb-6">Spending Overview</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={spendingData}>
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#BCBCBC" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#BCBCBC" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                      <XAxis dataKey="month" stroke="#6D6D6D" />
                      <YAxis stroke="#6D6D6D" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#404040',
                          border: '1px solid #6D6D6D',
                          borderRadius: '8px',
                          color: '#BCBCBC',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#BCBCBC"
                        fillOpacity={1}
                        fill="url(#colorAmount)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <Card className="bg-gunmetal/20 border-dim-grey/30 p-6">
                  <h3 className="text-silver mb-6">Project Activity (Hours)</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={projectActivityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                      <XAxis dataKey="week" stroke="#6D6D6D" />
                      <YAxis stroke="#6D6D6D" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#404040',
                          border: '1px solid #6D6D6D',
                          borderRadius: '8px',
                          color: '#BCBCBC',
                        }}
                      />
                      <Bar dataKey="hours" fill="#BCBCBC" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>
            </div>
            <br />

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <Card className="bg-gunmetal/20 border-dim-grey/30 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-silver">Recent Orders</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-dim-grey hover:text-silver"
                    >
                      View All
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {recentOrders.map((order, index) => {
                      const orderId = order._id || order.id || index;

                      // if product is an object, get its name
                      const productName =
                        typeof order.product === 'object' && order.product !== null
                          ? order.product.name
                          : order.product || 'N/A';

                      const orderDate = order.date
                        ? new Date(order.date).toLocaleDateString()
                        : 'N/A';

                      const amount = order.amount ? `$${order.amount}` : 'N/A';

                      const status = order.status || 'Pending';

                      return (
                        <div
                          key={orderId}
                          className="flex items-center justify-between p-4 rounded-lg bg-black/30 border border-gunmetal hover:border-dim-grey transition-colors"
                        >
                          <div className="flex-1">
                            <div className="text-silver text-sm mb-1">{productName}</div>
                            <div className="text-xs text-dim-grey">{orderDate}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-silver text-sm mb-1">{amount}</div>
                            <Badge className={getStatusColor(status)}>{status}</Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>


                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
              >
                <Card className="bg-gunmetal/20 border-dim-grey/30 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-silver">Recent Invoices</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-dim-grey hover:text-silver"
                    >
                      View All
                    </Button>
                  </div>
                  <div className="space-y-4">
                    

                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
  )
}

export default ClientOverview