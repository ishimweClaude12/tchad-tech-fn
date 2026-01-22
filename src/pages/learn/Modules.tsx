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
import { CheckIcon, Delete, Edit } from "lucide-react";
import CloseIcon from "@mui/icons-material/Close";
import { EmptyState } from "../../components/shared/EmptyState";
import { useCourses } from "../../hooks/learn/useCourseApi";

export default function Modules() {
  const { data: modules = [], isLoading } = useModules();

  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [toggleModuleId, setToggleModuleId] = useState<string | number | null>(
    null
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
        <div className="flex flex-col items-center justify-center py-16">
          <EmptyState message="No modules found. Click 'Add Module' to create one." />
        </div>
      );
    }

    return (
      <Table className="min-w-full">
        <TableHead>
          <TableRow className="bg-gray-100">
            <TableCell className="font-semibold">Title</TableCell>
            <TableCell className="font-semibold">Duration</TableCell>
            <TableCell className="font-semibold">Lessons</TableCell>
            <TableCell className="font-semibold">Published</TableCell>
            <TableCell className="font-semibold" align="right">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {modules.map((mod) => {
            let publishedIcon;
            if (toggleModuleId === mod.id) {
              publishedIcon = <CircularProgress size={24} />;
            } else if (mod.isPublished) {
              publishedIcon = <CheckIcon />;
            } else {
              publishedIcon = <CloseIcon />;
            }

            return (
              <TableRow key={mod.id} className="hover:bg-gray-50">
                <TableCell>{mod.title}</TableCell>
                <TableCell>{mod.estimatedDurationMinutes} min</TableCell>
                <TableCell>{mod.lessons.length}</TableCell>
                <TableCell>
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
                          onSuccess: () => {
                            setToggleModuleId(null);
                          },
                          onError: () => {
                            setToggleModuleId(null);
                          },
                        },
                      );
                    }}
                  >
                    {publishedIcon}
                  </ToggleButton>
                </TableCell>

                <TableCell align="right">
                  <div>
                    <Button
                      id="basic-button"
                      aria-controls={open ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={(e: React.MouseEvent<HTMLElement>) => {
                        e.stopPropagation();
                        handleClick(e);
                      }}
                      sx={{ zIndex: 2000, position: "relative" }}
                    >
                      <MoreVertIcon />
                    </Button>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      slotProps={{
                        list: {
                          "aria-labelledby": "basic-button",
                        },
                      }}
                    >
                      <MenuItem
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleEdit(mod);
                        }}
                      >
                        <IconButton aria-label="edit" color="primary">
                          <Edit />
                        </IconButton>{" "}
                        Edit
                      </MenuItem>
                      <MenuItem
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          setSelectedModule(mod);
                          setOpenDelete(true);
                        }}
                      >
                        <IconButton color="error">
                          <Delete />
                        </IconButton>
                        Delete
                      </MenuItem>
                    </Menu>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="p-6">
      <Card className="shadow-md">
        <CardHeader
          title={
            <Typography variant="h5" className="font-semibold">
              Manage Modules
            </Typography>
          }
          action={
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenCreate(true)}
            >
              Add Module
            </Button>
          }
        />

        <CardContent>{renderModulesContent()}</CardContent>
      </Card>

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
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent className="py-4">
          <Typography>
            Are you sure you want to delete the module "{selectedModule?.title}
            "?
          </Typography>
          <div className="mt-4 flex justify-end space-x-2 gap-2">
            <Button onClick={() => setOpenDelete(false)} variant="outlined">
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
