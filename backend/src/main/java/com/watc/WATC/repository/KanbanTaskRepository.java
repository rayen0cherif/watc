package com.watc.WATC.repository;

import com.watc.WATC.domain.KanbanTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KanbanTaskRepository extends JpaRepository<KanbanTask, Long> {
    List<KanbanTask> findByProjectId(Long projectId);
}
