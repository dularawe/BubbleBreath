"use client"

import { useState } from "react"
import { usePayments } from "@/hooks/use-api"
import { paymentApi, type Payment } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Pencil, Trash2, CreditCard, DollarSign, Users, TrendingUp, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function AdminPaymentsPage() {
  const { data: payments, isLoading, mutate } = usePayments()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)
  const [formData, setFormData] = useState({
    userId: "",
    amount: "",
    currency: "USD",
    status: "pending" as Payment["status"],
    paymentMethod: "",
    description: "",
  })

  const resetForm = () => {
    setFormData({
      userId: "",
      amount: "",
      currency: "USD",
      status: "pending",
      paymentMethod: "",
      description: "",
    })
  }

  const handleCreate = async () => {
    try {
      await paymentApi.create({
        userId: formData.userId,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        status: formData.status,
        paymentMethod: formData.paymentMethod,
        description: formData.description,
      })
      toast.success("Payment created successfully")
      setIsCreateOpen(false)
      resetForm()
      mutate()
    } catch {
      toast.error("Failed to create payment")
    }
  }

  const handleUpdate = async () => {
    if (!editingPayment) return
    try {
      await paymentApi.update({
        id: editingPayment.id,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        status: formData.status,
        paymentMethod: formData.paymentMethod,
        description: formData.description,
      })
      toast.success("Payment updated successfully")
      setEditingPayment(null)
      resetForm()
      mutate()
    } catch {
      toast.error("Failed to update payment")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment?")) return
    try {
      await paymentApi.delete(id)
      toast.success("Payment deleted successfully")
      mutate()
    } catch {
      toast.error("Failed to delete payment")
    }
  }

  const openEditDialog = (payment: Payment) => {
    setEditingPayment(payment)
    setFormData({
      userId: payment.userId,
      amount: payment.amount.toString(),
      currency: payment.currency,
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      description: payment.description || "",
    })
  }

  const totalRevenue = payments?.reduce((sum, p) => p.status === "completed" ? sum + p.amount : sum, 0) || 0
  const pendingPayments = payments?.filter(p => p.status === "pending").length || 0
  const completedPayments = payments?.filter(p => p.status === "completed").length || 0

  const getStatusColor = (status: Payment["status"]) => {
    switch (status) {
      case "completed": return "bg-green-500/20 text-green-700"
      case "pending": return "bg-yellow-500/20 text-yellow-700"
      case "failed": return "bg-red-500/20 text-red-700"
      case "refunded": return "bg-blue-500/20 text-blue-700"
      default: return "bg-muted text-muted-foreground"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payments Management</h1>
          <p className="text-muted-foreground">Manage payment transactions and revenue</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Payment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>User ID</Label>
                <Input
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  placeholder="Enter user ID"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={formData.currency} onValueChange={(v) => setFormData({ ...formData, currency: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as Payment["status"] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Input
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  placeholder="e.g., Credit Card, PayPal"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Payment description"
                />
              </div>
              <Button onClick={handleCreate} className="w-full">Create Payment</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
            <CreditCard className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{payments?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            <Users className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{pendingPayments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{completedPayments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments?.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-xs">{payment.id.slice(0, 8)}...</TableCell>
                  <TableCell className="font-mono text-xs">{payment.userId.slice(0, 8)}...</TableCell>
                  <TableCell className="font-semibold">
                    {payment.currency} {payment.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>{payment.paymentMethod}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog open={editingPayment?.id === payment.id} onOpenChange={(open) => !open && setEditingPayment(null)}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(payment)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Payment</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Amount</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={formData.amount}
                                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Currency</Label>
                                <Select value={formData.currency} onValueChange={(v) => setFormData({ ...formData, currency: v })}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="USD">USD</SelectItem>
                                    <SelectItem value="EUR">EUR</SelectItem>
                                    <SelectItem value="GBP">GBP</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Status</Label>
                              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as Payment["status"] })}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="failed">Failed</SelectItem>
                                  <SelectItem value="refunded">Refunded</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Payment Method</Label>
                              <Input
                                value={formData.paymentMethod}
                                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Input
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                              />
                            </div>
                            <Button onClick={handleUpdate} className="w-full">Update Payment</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(payment.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!payments || payments.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No payments found. Create your first payment above.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
