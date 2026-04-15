import MainLayout from "@templates/MainLayout.tsx";
import { useEffect, useState } from "react";
import { Button } from "@components/ui/button.tsx";
import useAxiosPrivate from "@hooks/useAxiosPrivate.ts";
import { MdOutlineAdminPanelSettings, MdEdit, MdDelete, MdAdd, MdCheck, MdClose } from "react-icons/md";

// ── Generic types ──────────────────────────────────────────────────────────────

type Status = "idle" | "loading" | "error";

interface CommunityCode {
    community_name: string;
    community_code: string;
}

// ── Reusable inline-edit row ───────────────────────────────────────────────────

function EditableRow({
    value,
    onSave,
    onCancel,
}: {
    value: string;
    onSave: (newVal: string) => void;
    onCancel: () => void;
}) {
    const [draft, setDraft] = useState(value);
    return (
        <div className="flex items-center gap-2">
            <input
                className="flex-1 border border-border rounded px-2 py-1 text-sm bg-default-bg2 text-default-fg1"
                value={draft}
                autoFocus
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => {
                    if (e.key === "Enter") onSave(draft);
                    if (e.key === "Escape") onCancel();
                }}
            />
            <button onClick={() => onSave(draft)} className="text-green-600 hover:text-green-800"><MdCheck size="1.2rem" /></button>
            <button onClick={onCancel} className="text-red-500 hover:text-red-700"><MdClose size="1.2rem" /></button>
        </div>
    );
}

// ── Section wrapper ────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-lg border border-border bg-default-bg1 p-5 mb-5">
            <h2 className="text-base font-semibold text-default-fg1 mb-4">{title}</h2>
            {children}
        </div>
    );
}

// ── Status message ─────────────────────────────────────────────────────────────

function ErrorMsg({ msg }: { msg: string }) {
    if (!msg) return null;
    return <p className="text-sm text-red-600 mt-1">{msg}</p>;
}

// ── SIMPLE LIST SECTION (engineers, plat-engineers, counties) ──────────────────

function SimpleListSection({
    title,
    items,
    addLabel,
    onAdd,
    onRename,
    onDelete,
    fieldName,
}: {
    title: string;
    items: string[];
    addLabel: string;
    onAdd: (name: string) => Promise<void>;
    onRename: (oldName: string, newName: string) => Promise<void>;
    onDelete: (name: string) => Promise<void>;
    fieldName: string;
}) {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [addingNew, setAddingNew] = useState(false);
    const [newName, setNewName] = useState("");
    const [error, setError] = useState("");

    async function handleAdd() {
        if (!newName.trim()) return;
        setError("");
        try {
            await onAdd(newName.trim());
            setNewName("");
            setAddingNew(false);
        } catch (e: any) {
            setError(e?.response?.data?.detail ?? "Error adding item");
        }
    }

    async function handleRename(idx: number, newVal: string) {
        if (!newVal.trim()) { setEditingIndex(null); return; }
        setError("");
        try {
            await onRename(items[idx], newVal.trim());
            setEditingIndex(null);
        } catch (e: any) {
            setError(e?.response?.data?.detail ?? "Error renaming item");
        }
    }

    async function handleDelete(name: string) {
        if (!window.confirm(`Delete "${name}"?`)) return;
        setError("");
        try {
            await onDelete(name);
        } catch (e: any) {
            setError(e?.response?.data?.detail ?? "Error deleting item");
        }
    }

    return (
        <Section title={title}>
            <div className="space-y-1 mb-3">
                {items.map((item, idx) => (
                    <div key={item} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-default-bg2 group">
                        {editingIndex === idx ? (
                            <EditableRow
                                value={item}
                                onSave={val => handleRename(idx, val)}
                                onCancel={() => setEditingIndex(null)}
                            />
                        ) : (
                            <>
                                <span className="flex-1 text-sm text-default-fg1">{item}</span>
                                <button
                                    className="opacity-0 group-hover:opacity-100 text-default-fg2 hover:text-default-fg1 transition-opacity"
                                    onClick={() => setEditingIndex(idx)}
                                    title="Edit"
                                >
                                    <MdEdit size="1rem" />
                                </button>
                                <button
                                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity"
                                    onClick={() => handleDelete(item)}
                                    title="Delete"
                                >
                                    <MdDelete size="1rem" />
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {addingNew ? (
                <div className="flex items-center gap-2 mt-2">
                    <input
                        autoFocus
                        placeholder={addLabel}
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === "Enter") handleAdd();
                            if (e.key === "Escape") { setAddingNew(false); setNewName(""); }
                        }}
                        className="flex-1 border border-border rounded px-2 py-1 text-sm bg-default-bg2 text-default-fg1"
                    />
                    <button onClick={handleAdd} className="text-green-600 hover:text-green-800"><MdCheck size="1.2rem" /></button>
                    <button onClick={() => { setAddingNew(false); setNewName(""); }} className="text-red-500 hover:text-red-700"><MdClose size="1.2rem" /></button>
                </div>
            ) : (
                <Button
                    variant="outline"
                    className="mt-1 flex items-center gap-1 text-sm h-8"
                    onClick={() => setAddingNew(true)}
                >
                    <MdAdd size="1rem" /> Add {fieldName}
                </Button>
            )}
            <ErrorMsg msg={error} />
        </Section>
    );
}

// ── COMMUNITY SECTION (name + code) ───────────────────────────────────────────

// Column widths as inline styles — avoids Tailwind purging arbitrary values in production
const COL_NAME: React.CSSProperties  = { flex: "1 1 0", minWidth: 0 };
const COL_CODE: React.CSSProperties  = { width: "90px", flexShrink: 0 };
const COL_BTNS: React.CSSProperties  = { width: "56px", flexShrink: 0 };

function CommunitiesSection({
    communities,
    communityCodes,
    onAddCommunity,
    onRenameCommunity,
    onDeleteCommunity,
    onAddCode,
    onUpdateCode,
    onDeleteCode,
}: {
    communities: string[];
    communityCodes: CommunityCode[];
    onAddCommunity: (name: string) => Promise<void>;
    onRenameCommunity: (oldName: string, newName: string) => Promise<void>;
    onDeleteCommunity: (name: string) => Promise<void>;
    onAddCode: (name: string, code: string) => Promise<void>;
    onUpdateCode: (name: string, newCode: string) => Promise<void>;
    onDeleteCode: (name: string) => Promise<void>;
}) {
    // editing state: tracks the community name being edited
    const [editingName, setEditingName] = useState<string | null>(null);
    const [draftName, setDraftName] = useState("");
    const [draftCode, setDraftCode] = useState("");

    const [addingNew, setAddingNew] = useState(false);
    const [newCommunityName, setNewCommunityName] = useState("");
    const [newCommunityCode, setNewCommunityCode] = useState("");
    const [error, setError] = useState("");

    const codeMap = Object.fromEntries(communityCodes.map(c => [c.community_name, c.community_code]));

    function openEdit(name: string) {
        setEditingName(name);
        setDraftName(name);
        setDraftCode(codeMap[name] ?? "");
        setError("");
    }

    function cancelEdit() {
        setEditingName(null);
        setDraftName("");
        setDraftCode("");
    }

    async function handleSaveEdit() {
        if (!draftName.trim()) { setError("Community name cannot be empty."); return; }
        if (!draftCode.trim()) { setError("Code cannot be empty."); return; }
        const existingCodes = Object.entries(codeMap)
            .filter(([n]) => n !== editingName)
            .map(([, c]) => c.toLowerCase());
        if (existingCodes.includes(draftCode.trim().toLowerCase())) {
            setError(`Code "${draftCode.trim()}" is already used by another community.`);
            return;
        }
        setError("");
        try {
            const nameChanged = draftName.trim() !== editingName;
            const codeChanged = draftCode.trim() !== (codeMap[editingName!] ?? "");

            if (nameChanged) {
                await onRenameCommunity(editingName!, draftName.trim());
            }
            const effectiveName = nameChanged ? draftName.trim() : editingName!;
            if (codeChanged) {
                if (codeMap[editingName!] !== undefined) {
                    await onUpdateCode(effectiveName, draftCode.trim());
                } else {
                    await onAddCode(effectiveName, draftCode.trim());
                }
            }
            cancelEdit();
        } catch (e: any) {
            setError(e?.response?.data?.detail ?? "Error saving changes");
        }
    }

    async function handleAddCommunity() {
        if (!newCommunityName.trim()) { setError("Community name cannot be empty."); return; }
        if (!newCommunityCode.trim()) { setError("Community code cannot be empty."); return; }
        const existingCodes = Object.values(codeMap).map(c => c.toLowerCase());
        if (existingCodes.includes(newCommunityCode.trim().toLowerCase())) {
            setError(`Code "${newCommunityCode.trim()}" is already used by another community.`);
            return;
        }
        setError("");
        try {
            await onAddCommunity(newCommunityName.trim());
            await onAddCode(newCommunityName.trim(), newCommunityCode.trim());
            setNewCommunityName("");
            setNewCommunityCode("");
            setAddingNew(false);
        } catch (e: any) {
            setError(e?.response?.data?.detail ?? "Error adding community");
        }
    }

    async function handleDeleteCommunity(name: string) {
        if (!window.confirm(`Delete community "${name}"? This will also remove its code mapping.`)) return;
        setError("");
        try {
            await onDeleteCommunity(name);
            if (codeMap[name] !== undefined) {
                await onDeleteCode(name);
            }
        } catch (e: any) {
            setError(e?.response?.data?.detail ?? "Error deleting community");
        }
    }

    return (
        <Section title="Communities">
            {/* Header row */}
            <div className="flex gap-2 px-2 pb-1 border-b border-border mb-1">
                <span style={COL_NAME} className="text-xs font-medium text-default-fg2 uppercase tracking-wide">Community Name</span>
                <span style={COL_CODE} className="text-xs font-medium text-default-fg2 uppercase tracking-wide">Code</span>
                <span style={COL_BTNS} />
            </div>

            <div className="mb-3">
                {communities.map(name => (
                    <div key={name} className="flex gap-2 items-center px-2 py-1 rounded hover:bg-default-bg2 group">

                        {editingName === name ? (
                            /* ── Edit mode: both fields + one confirm ── */
                            <>
                                <div style={COL_NAME}>
                                    <input
                                        autoFocus
                                        value={draftName}
                                        onChange={e => setDraftName(e.target.value)}
                                        onKeyDown={e => { if (e.key === "Escape") cancelEdit(); }}
                                        className="w-full border border-border rounded px-2 py-0.5 text-sm bg-default-bg2 text-default-fg1"
                                    />
                                </div>
                                <div style={COL_CODE}>
                                    <input
                                        value={draftCode}
                                        onChange={e => setDraftCode(e.target.value)}
                                        onKeyDown={e => { if (e.key === "Enter") handleSaveEdit(); if (e.key === "Escape") cancelEdit(); }}
                                        className="w-full border border-border rounded px-2 py-0.5 text-sm bg-default-bg2 text-default-fg1 font-mono"
                                        placeholder="Code"
                                    />
                                </div>
                                <div style={COL_BTNS} className="flex items-center gap-1">
                                    <button onClick={handleSaveEdit} className="text-green-600 hover:text-green-800"><MdCheck size="1.2rem" /></button>
                                    <button onClick={cancelEdit} className="text-red-500 hover:text-red-700"><MdClose size="1.2rem" /></button>
                                </div>
                            </>
                        ) : (
                            /* ── View mode ── */
                            <>
                                <span style={COL_NAME} className="text-sm text-default-fg1 truncate">{name}</span>
                                <span style={COL_CODE} className="text-sm font-mono text-default-fg2">
                                    {codeMap[name] ?? <span className="text-xs italic opacity-50">— none —</span>}
                                </span>
                                <div style={COL_BTNS} className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        className="text-default-fg2 hover:text-default-fg1"
                                        onClick={() => openEdit(name)}
                                        title="Edit"
                                    >
                                        <MdEdit size="1rem" />
                                    </button>
                                    <button
                                        className="text-red-400 hover:text-red-600"
                                        onClick={() => handleDeleteCommunity(name)}
                                        title="Delete"
                                    >
                                        <MdDelete size="1rem" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Add new community row */}
            {addingNew ? (
                <div className="flex gap-2 items-center mt-2">
                    <div style={COL_NAME}>
                        <input
                            autoFocus
                            placeholder="Community name"
                            value={newCommunityName}
                            onChange={e => setNewCommunityName(e.target.value)}
                            onKeyDown={e => { if (e.key === "Escape") { setAddingNew(false); setNewCommunityName(""); setNewCommunityCode(""); } }}
                            className="w-full border border-border rounded px-2 py-1 text-sm bg-default-bg2 text-default-fg1"
                        />
                    </div>
                    <div style={COL_CODE}>
                        <input
                            placeholder="Code"
                            value={newCommunityCode}
                            onChange={e => setNewCommunityCode(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") handleAddCommunity(); }}
                            className="w-full border border-border rounded px-2 py-1 text-sm bg-default-bg2 text-default-fg1 font-mono"
                        />
                    </div>
                    <div style={COL_BTNS} className="flex items-center gap-1">
                        <button onClick={handleAddCommunity} className="text-green-600 hover:text-green-800"><MdCheck size="1.2rem" /></button>
                        <button onClick={() => { setAddingNew(false); setNewCommunityName(""); setNewCommunityCode(""); }} className="text-red-500 hover:text-red-700"><MdClose size="1.2rem" /></button>
                    </div>
                </div>
            ) : (
                <Button
                    variant="outline"
                    className="mt-1 flex items-center gap-1 text-sm h-8"
                    onClick={() => setAddingNew(true)}
                >
                    <MdAdd size="1rem" /> Add Community
                </Button>
            )}
            <ErrorMsg msg={error} />
        </Section>
    );
}

// ── Main page ──────────────────────────────────────────────────────────────────

function AdminDataPage() {
    const axios = useAxiosPrivate();

    const [communities, setCommunities] = useState<string[]>([]);
    const [communityCodes, setCommunityCodes] = useState<CommunityCode[]>([]);
    const [engineers, setEngineers] = useState<string[]>([]);
    const [platEngineers, setPlatEngineers] = useState<string[]>([]);
    const [counties, setCounties] = useState<string[]>([]);
    const [status, setStatus] = useState<Status>("loading");

    // ── Fetch all on mount ────────────────────────────────────────────────────

    useEffect(() => {
        async function fetchAll() {
            setStatus("loading");
            try {
                const [comm, codes, eng, plat, cnt] = await Promise.all([
                    axios.get<string[]>("/eagle/communities"),
                    axios.get<CommunityCode[]>("/eagle/community-codes"),
                    axios.get<string[]>("/eagle/engineers"),
                    axios.get<string[]>("/eagle/plat-engineers"),
                    axios.get<string[]>("/eagle/counties"),
                ]);
                setCommunities(comm.data);
                setCommunityCodes(codes.data);
                setEngineers(eng.data);
                setPlatEngineers(plat.data);
                setCounties(cnt.data);
                setStatus("idle");
            } catch {
                setStatus("error");
            }
        }
        fetchAll();
    }, []);

    // ── Community handlers ────────────────────────────────────────────────────

    async function addCommunity(name: string) {
        const res = await axios.post("/eagle/communities", { community_name: name });
        setCommunities(res.data.added ?? res.data);
    }

    async function renameCommunity(oldName: string, newName: string) {
        const res = await axios.patch("/eagle/communities", {
            target_community_name: oldName,
            new_community_name: newName,
        });
        const updated = res.data["Updated. now"] ?? res.data;
        setCommunities(updated);
        // Also rename in community codes if an entry exists
        setCommunityCodes(prev =>
            prev.map(c => c.community_name === oldName ? { ...c, community_name: newName } : c)
        );
    }

    async function deleteCommunity(name: string) {
        const res = await axios.delete("/eagle/communities", { data: { community_name: name } });
        const updated = res.data["deleted. now"] ?? res.data;
        setCommunities(updated);
    }

    // ── Community code handlers ───────────────────────────────────────────────

    async function addCode(name: string, code: string) {
        const res = await axios.post("/eagle/community-codes", { community_name: name, community_code: code });
        setCommunityCodes(res.data);
    }

    async function updateCode(name: string, newCode: string) {
        const res = await axios.patch("/eagle/community-codes", {
            target_community_name: name,
            new_community_code: newCode,
        });
        setCommunityCodes(res.data);
    }

    async function deleteCode(name: string) {
        const res = await axios.delete("/eagle/community-codes", {
            data: { community_name: name, community_code: "" },
        });
        setCommunityCodes(res.data);
    }

    // ── Engineer handlers ─────────────────────────────────────────────────────

    async function addEngineer(name: string) {
        const res = await axios.post("/eagle/engineers", { engineer_name: name });
        setEngineers(res.data.added ?? res.data);
    }

    async function renameEngineer(oldName: string, newName: string) {
        const res = await axios.patch("/eagle/engineers", {
            target_engineer_name: oldName,
            new_engineer_name: newName,
        });
        setEngineers(res.data["Updated. now"] ?? res.data);
    }

    async function deleteEngineer(name: string) {
        const res = await axios.delete("/eagle/engineers", { data: { engineer_name: name } });
        setEngineers(res.data["deleted. now"] ?? res.data);
    }

    // ── Plat engineer handlers ────────────────────────────────────────────────

    async function addPlatEngineer(name: string) {
        const res = await axios.post("/eagle/plat-engineers", { plat_engineer_name: name });
        setPlatEngineers(res.data.added ?? res.data);
    }

    async function renamePlatEngineer(oldName: string, newName: string) {
        const res = await axios.patch("/eagle/plat-engineers", {
            target_plat_engineer_name: oldName,
            new_plat_engineer_name: newName,
        });
        setPlatEngineers(res.data["Updated. now"] ?? res.data);
    }

    async function deletePlatEngineer(name: string) {
        const res = await axios.delete("/eagle/plat-engineers", { data: { plat_engineer_name: name } });
        setPlatEngineers(res.data["deleted. now"] ?? res.data);
    }

    // ── County handlers ───────────────────────────────────────────────────────

    async function addCounty(name: string) {
        const res = await axios.post("/eagle/counties", { county_name: name });
        setCounties(res.data.added ?? res.data);
    }

    async function renameCounty(oldName: string, newName: string) {
        const res = await axios.patch("/eagle/counties", {
            target_county_name: oldName,
            new_county_name: newName,
        });
        setCounties(res.data["Updated. now"] ?? res.data);
    }

    async function deleteCounty(name: string) {
        const res = await axios.delete("/eagle/counties", { data: { county_name: name } });
        setCounties(res.data["deleted. now"] ?? res.data);
    }

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <MainLayout>
            <div className="p-6 max-w-3xl mx-auto">

                {/* Page header */}
                <div className="flex items-center gap-3 mb-6">
                    <MdOutlineAdminPanelSettings size="1.8rem" className="text-default-fg1" />
                    <div>
                        <h1 className="text-2xl font-bold text-default-fg1">Admin — Reference Data</h1>
                        <p className="text-sm text-default-fg2 mt-0.5">
                            Manage communities, engineers, plat engineers, and counties
                        </p>
                    </div>
                </div>

                {status === "loading" && (
                    <p className="text-sm text-default-fg2">Loading...</p>
                )}
                {status === "error" && (
                    <p className="text-sm text-red-600">Failed to load data. Check your connection and try refreshing.</p>
                )}

                {status === "idle" && (
                    <>
                        <CommunitiesSection
                            communities={communities}
                            communityCodes={communityCodes}
                            onAddCommunity={addCommunity}
                            onRenameCommunity={renameCommunity}
                            onDeleteCommunity={deleteCommunity}
                            onAddCode={addCode}
                            onUpdateCode={updateCode}
                            onDeleteCode={deleteCode}
                        />

                        <SimpleListSection
                            title="Engineers"
                            items={engineers}
                            addLabel="Engineer name"
                            fieldName="Engineer"
                            onAdd={addEngineer}
                            onRename={renameEngineer}
                            onDelete={deleteEngineer}
                        />

                        <SimpleListSection
                            title="Plat Engineers"
                            items={platEngineers}
                            addLabel="Plat engineer name"
                            fieldName="Plat Engineer"
                            onAdd={addPlatEngineer}
                            onRename={renamePlatEngineer}
                            onDelete={deletePlatEngineer}
                        />

                        <SimpleListSection
                            title="Counties"
                            items={counties}
                            addLabel="County name"
                            fieldName="County"
                            onAdd={addCounty}
                            onRename={renameCounty}
                            onDelete={deleteCounty}
                        />
                    </>
                )}

            </div>
        </MainLayout>
    );
}

export default AdminDataPage;
