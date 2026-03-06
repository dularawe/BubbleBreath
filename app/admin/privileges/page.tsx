"use client"

import { useState } from "react"
import { usePrivileges } from "@/hooks/use-api"
import { privilegeApi, type Privilege } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Pencil, Trash2, Shield, Key, Users, Lock, Loader2 } from "lucide-react"
import { toast } from "sonner"

const availablePermissions = [
  "games.read",
  "games.create",
  "games.update",
  "games.delete",
  "categories.read",
  "categories.create",
  "categories.update",
  "categories.delete",
  "achievements.read",
  "achievements.create",
  "achievements.update",
  "achievements.delete",
  "challenges.read",
  "challenges.create",
  "challenges.update",
  "challenges.delete",
  "reviews.read",
  "reviews.create",
  "reviews.update",
  "reviews.delete",
  "reviews.approve",
  "payments.read",
  "payments.create",
  "payments.update",
  "payments.delete",
  "users.read",
  "users.create",
  "users.update",
  "users.delete",
  "admin.access",
]

export default function AdminPrivilegesPage() {
  const { data: privileges, isLoading, mutate } = usePrivileges()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingPrivilege, setEditingPrivilege] = useState<Privilege | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  })

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      permissions: [],
    })
  }

  const handleCreate = async () => {
    try {
      await privilegeApi.create({
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions,
      })
      toast.success("Privilege created successfully")
      setIsCreateOpen(false)
      resetForm()
      mutate()
    } catch {
      toast.error("Failed to create privilege")
    }
  }

  const handleUpdate = async () => {
    if (!editingPrivilege) return
    try {
      await privilegeApi.update({
        id: editingPrivilege.id,
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions,
      })
      toast.success("Privilege updated successfully")
      setEditingPrivilege(null)
      resetForm()
      mutate()
    } catch {
      toast.error("Failed to update privilege")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this privilege?")) return
    try {
      await privilegeApi.delete(id)
      toast.success("Privilege deleted successfully")
      mutate()
    } catch {
      toast.error("Failed to delete privilege")
    }
  }

  const openEditDialog = (privilege: Privilege) => {
    setEditingPrivilege(privilege)
    setFormData({
      name: privilege.name,
      description: privilege.description,
      permissions: privilege.permissions,
    })
  }

  const togglePermission = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }))
  }

  const totalPermissions = privileges?.reduce((sum, p) => sum + p.permissions.length, 0) || 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const PermissionSelector = () => (
    <div className="space-y-2 max-h-[300px] overflow-y-auto border rounded-lg p-4">
      {availablePermissions.map((permission) => (
        <label key={permission} className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1 rounded">
          <input
            type="checkbox"
            checked={formData.permissions.includes(permission)}
            onChange={() => togglePermission(permission)}
            className="rounded border-input"
          />
          <span className="text-sm font-mono">{permission}</span>
        </label>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Privileges Management</h1>
          <p className="text-muted-foreground">Manage user roles and permissions</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Privilege
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Privilege</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Admin, Moderator, User"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what this privilege allows"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Permissions ({formData.permissions.length} selected)</Label>
                <PermissionSelector />
              </div>
              <Button onClick={handleCreate} className="w-full">Create Privilege</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Roles</CardTitle>
            <Shield className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{privileges?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Permissions</CardTitle>
            <Key className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalPermissions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available Permissions</CardTitle>
            <Lock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{availablePermissions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Permissions/Role</CardTitle>
            <Users className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {privileges?.length ? (totalPermissions / privileges.length).toFixed(1) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Privileges Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Privileges</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {privileges?.map((privilege) => (
                <TableRow key={privilege.id}>
                  <TableCell className="font-semibold">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      {privilege.name}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground">
                    {privilege.description}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[300px]">
                      {privilege.permissions.slice(0, 3).map((perm) => (
                        <Badge key={perm} variant="outline" className="text-xs font-mono">
                          {perm}
                        </Badge>
                      ))}
                      {privilege.permissions.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{privilege.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(privilege.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog open={editingPrivilege?.id === privilege.id} onOpenChange={(open) => !open && setEditingPrivilege(null)}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(privilege)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Privilege</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Name</Label>
                              <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={2}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Permissions ({formData.permissions.length} selected)</Label>
                              <PermissionSelector />
                            </div>
                            <Button onClick={handleUpdate} className="w-full">Update Privilege</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(privilege.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!privileges || privileges.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No privileges found. Create your first privilege above.
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
