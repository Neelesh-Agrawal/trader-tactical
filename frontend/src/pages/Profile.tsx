import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import { Header } from '@/components/layout/Header';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, Calendar, Award, Edit2, Save, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const { user, profile, streak, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    date_of_birth: ''
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/login" replace />;
  }

  const startEditing = () => {
    setFormData({
      name: profile.name,
      phone_number: profile.phone_number || '',
      date_of_birth: profile.date_of_birth || ''
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Split name into first_name and last_name
      const nameParts = formData.name.split(' ').filter(Boolean);
      const first_name = nameParts[0] || formData.name;
      const last_name = nameParts.slice(1).join(' ');

      await apiFetch('/api/auth/me/update/', {
        method: 'PATCH',
        body: JSON.stringify({
          first_name,
          last_name,
          phone: formData.phone_number,
          // Backend doesn't have date_of_birth field, so we'll skip it
          // age can be calculated if needed
        }),
      });

      await refreshProfile();
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0]?.[0]?.toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showStreak />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Breadcrumb items={[{ label: 'Profile' }]} />

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Card */}
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your account details</CardDescription>
              </div>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={startEditing} className="gap-2">
                  <Edit2 className="h-4 w-4" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} disabled={isSaving}>
                    <X className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={isSaving} className="gap-2">
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                  {getInitials(profile.name)}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{profile.name}</h2>
                  <p className="text-muted-foreground">{profile.current_level} Level</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  ) : (
                    <p className="py-2 px-3 bg-muted rounded-md">{profile.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <p className="py-2 px-3 bg-muted rounded-md text-muted-foreground">{profile.email}</p>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone_number}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                    />
                  ) : (
                    <p className="py-2 px-3 bg-muted rounded-md">{profile.phone_number}</p>
                  )}
                </div>

                {/* DOB */}
                <div className="space-y-2">
                  <Label htmlFor="dob" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date of Birth
                  </Label>
                  {isEditing ? (
                    <Input
                      id="dob"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                    />
                  ) : (
                    <p className="py-2 px-3 bg-muted rounded-md">
                      {profile.date_of_birth 
                        ? new Date(profile.date_of_birth).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'Not set'}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-warning" />
                Your Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                <span className="text-sm">Current Streak</span>
                <span className="text-xl font-bold text-warning">{streak?.current_streak || 0} days</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                <span className="text-sm">Longest Streak</span>
                <span className="text-xl font-bold text-success">{streak?.longest_streak || 0} days</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                <span className="text-sm">Current Level</span>
                <span className="text-xl font-bold text-primary capitalize">{profile.current_level}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
