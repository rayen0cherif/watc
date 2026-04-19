package com.watc.WATC.repository;

import com.watc.WATC.domain.JournalUpdate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JournalUpdateRepository extends JpaRepository<JournalUpdate, Long> {
    List<JournalUpdate> findByProjectId(Long projectId);
}
