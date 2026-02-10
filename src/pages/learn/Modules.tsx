import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
  IconButton,
  ToggleButton,
  useMediaQuery,
  useTheme,
  Chip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import type { Module, ModuleFormData } from "../../types/Module.types";
import {
  useCreateModule,
  useDeleteModule,
  useModules,
  useToggleModulePublished,
} from "../../hooks/useApi";
import ModuleFormModal from "../../components/learn/forms/ModuleForm";
import React, { useState } from "react";
import { CheckIcon, Delete, Edit, Clock, BookOpen } from "lucide-react";
import CloseIcon from "@mui/icons-material/Close";
import { EmptyState } from "../../components/shared/EmptyState";
import { useCourses } from "../../hooks/learn/useCourseApi";

export default function Modules() {
  const { data: modules = [], isLoading } = useModules();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [toggleModuleId, setToggleModuleId] = useState<string | number | null>(
    null,
  );
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const { data: coursesData, isLoading: coursesLoading } = useCourses();
  const createModuleMutation = useCreateModule();
  const deleteModuleMutation = useDeleteModule();
  const toggleModulePublishMutation = useToggleModulePublished();

  const courses = coursesData
    ? coursesData.data.courses.map((course) => ({
        id: course.id,
        title: course.title,
      }))
    : [];

  const handleEdit = (mod: Module) => {
    setSelectedModule(mod);
    setOpenEdit(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenEdit(false);
    setSelectedModule(null);
  };

  const renderPublishIcon = (mod: Module) => {
    if (toggleModuleId === mod.id) {
      return <CircularProgress size={20} />;
    } else if (mod.isPublished) {
      return <CheckIcon size={20} />;
    } else {
      return <CloseIcon fontSize="small" />;
    }
  };

  // Mobile Card View
  const renderMobileCards = () => {
    return (
      <div className="space-y-4">
        {modules.map((mod) => (
          <Card
            key={mod.id}
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              {/* Header Row */}
              <div className="flex items-start justify-between mb-3">
                <Typography variant="h6" className="font-semibold flex-1 pr-2">
                  {mod.title}
                </Typography>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    setSelectedModule(mod);
                    handleClick(e);
                  }}
                  className="ml-2"
                >
                  <MoreVertIcon />
                </IconButton>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-500" />
                  <Typography variant="body2" className="text-gray-600">
                    {mod.estimatedDurationMinutes} min
                  </Typography>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-gray-500" />
                  <Typography variant="body2" className="text-gray-600">
                    {mod.lessons.length} lessons
                  </Typography>
                </div>
              </div>

              {/* Published Status */}
              <div className="flex items-center justify-between pt-3 border-t">
                <Typography variant="body2" className="text-gray-600">
                  Status:
                </Typography>
                <ToggleButton
                  value="check"
                  selected={mod.isPublished}
                  size="small"
                  onChange={() => {
                    setToggleModuleId(mod.id);
                    toggleModulePublishMutation.mutate(
                      {
                        id: mod.id,
                        isPublished: !mod.isPublished,
                      },
                      {
                        onSuccess: () => setToggleModuleId(null),
                        onError: () => setToggleModuleId(null),
                      },
                    );
                  }}
                  sx={{ height: 32 }}
                >
                  {renderPublishIcon(mod)}
                </ToggleButton>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Tablet Compact Table View
  const renderTabletTable = () => {
    return (
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHead>
            <TableRow className="bg-gray-100">
              <TableCell className="font-semibold">Module</TableCell>
              <TableCell className="font-semibold" align="center">
                Published
              </TableCell>
              <TableCell className="font-semibold" align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {modules.map((mod) => (
              <TableRow key={mod.id} className="hover:bg-gray-50">
                <TableCell>
                  <div>
                    <Typography variant="body1" className="font-medium mb-1">
                      {mod.title}
                    </Typography>
                    <div className="flex gap-2 flex-wrap">
                      <Chip
                        size="small"
                        icon={<Clock size={14} />}
                        label={`${mod.estimatedDurationMinutes} min`}
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        icon={<BookOpen size={14} />}
                        label={`${mod.lessons.length} lessons`}
                        variant="outlined"
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell align="center">
                  <ToggleButton
                    value="check"
                    selected={mod.isPublished}
                    size="small"
                    onChange={() => {
                      setToggleModuleId(mod.id);
                      toggleModulePublishMutation.mutate(
                        {
                          id: mod.id,
                          isPublished: !mod.isPublished,
                        },
                        {
                          onSuccess: () => setToggleModuleId(null),
                          onError: () => setToggleModuleId(null),
                        },
                      );
                    }}
                  >
                    {renderPublishIcon(mod)}
                  </ToggleButton>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      setSelectedModule(mod);
                      handleClick(e);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  // Desktop Full Table View
  const renderDesktopTable = () => {
    return (
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHead>
            <TableRow className="bg-gray-100">
              <TableCell className="font-semibold">Title</TableCell>
              <TableCell className="font-semibold">Duration</TableCell>
              <TableCell className="font-semibold">Lessons</TableCell>
              <TableCell className="font-semibold" align="center">
                Published
              </TableCell>
              <TableCell className="font-semibold" align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {modules.map((mod) => (
              <TableRow key={mod.id} className="hover:bg-gray-50">
                <TableCell>
                  <Typography variant="body1" className="font-medium">
                    {mod.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock size={16} className="text-gray-500" />
                    <span>{mod.estimatedDurationMinutes} min</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <BookOpen size={16} className="text-gray-500" />
                    <span>{mod.lessons.length}</span>
                  </div>
                </TableCell>
                <TableCell align="center">
                  <ToggleButton
                    value="check"
                    selected={mod.isPublished}
                    onChange={() => {
                      setToggleModuleId(mod.id);
                      toggleModulePublishMutation.mutate(
                        {
                          id: mod.id,
                          isPublished: !mod.isPublished,
                        },
                        {
                          onSuccess: () => setToggleModuleId(null),
                          onError: () => setToggleModuleId(null),
                        },
                      );
                    }}
                  >
                    {renderPublishIcon(mod)}
                  </ToggleButton>
                </TableCell>

                <TableCell align="right">
                  <IconButton
                    onClick={(e) => {
                      setSelectedModule(mod);
                      handleClick(e);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderModulesContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-10">
          <CircularProgress />
        </div>
      );
    }

    if (modules.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <EmptyState message="No modules found. Click 'Add Module' to create one." />
        </div>
      );
    }

    // Responsive rendering based on screen size
    if (isMobile) {
      return renderMobileCards();
    } else if (isTablet) {
      return renderTabletTable();
    } else {
      return renderDesktopTable();
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <Card className="shadow-md">
        <CardHeader
          title={
            <Typography
              variant={isMobile ? "h6" : "h5"}
              className="font-semibold"
            >
              Manage Modules
            </Typography>
          }
          action={
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenCreate(true)}
              size={isMobile ? "small" : "medium"}
              className="whitespace-nowrap"
            >
              {isMobile ? "Add" : "Add Module"}
            </Button>
          }
          className="pb-2"
        />

        <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
          {renderModulesContent()}
        </CardContent>
      </Card>

      {/* Actions Menu */}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        slotProps={{
          paper: {
            sx: { minWidth: 160 },
          },
        }}
      >
        <MenuItem
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            if (selectedModule) handleEdit(selectedModule);
            handleClose();
          }}
        >
          <IconButton size="small" aria-label="edit" color="primary">
            <Edit size={18} />
          </IconButton>
          <span className="ml-2">Edit</span>
        </MenuItem>
        <MenuItem
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            setOpenDelete(true);
            handleClose();
          }}
        >
          <IconButton size="small" color="error">
            <Delete size={18} />
          </IconButton>
          <span className="ml-2">Delete</span>
        </MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <ModuleFormModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        onSubmit={(data: ModuleFormData) => {
          createModuleMutation.mutate(data, {
            onSuccess: () => {
              setOpenEdit(false);
            },
          });
        }}
        initialData={undefined}
        loading={false}
        error={undefined}
        courses={courses}
        loadingCourses={coursesLoading}
        mode={"create"}
      />

      {/* Create Dialog */}
      <ModuleFormModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={(data: ModuleFormData) => {
          createModuleMutation.mutate(data, {
            onSuccess: () => {
              setOpenCreate(false);
            },
          });
        }}
        initialData={undefined}
        loading={false}
        error={undefined}
        courses={courses}
        loadingCourses={coursesLoading}
        mode={"create"}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            m: isMobile ? 2 : 3,
            maxWidth: isMobile ? "calc(100% - 32px)" : "xs",
          },
        }}
      >
        <DialogTitle className={isMobile ? "text-base" : ""}>
          Confirm Delete
        </DialogTitle>
        <DialogContent className="py-4">
          <Typography variant={isMobile ? "body2" : "body1"}>
            Are you sure you want to delete the module "{selectedModule?.title}
            "?
          </Typography>
          <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
            <Button
              onClick={() => setOpenDelete(false)}
              variant="outlined"
              fullWidth={isMobile}
              size={isMobile ? "medium" : "large"}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedModule) {
                  deleteModuleMutation.mutate(selectedModule.id, {
                    onSuccess: () => {
                      setOpenDelete(false);
                      setSelectedModule(null);
                    },
                  });
                }
              }}
              variant="contained"
              color="error"
              fullWidth={isMobile}
              size={isMobile ? "medium" : "large"}
              disabled={deleteModuleMutation.isPending}
            >
              {deleteModuleMutation.isPending ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
