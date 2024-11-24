const { simpleGit } = require('simple-git');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

class GitAnalytics {
    constructor(supabase) {
        this.supabase = supabase;
        this.tempDir = path.join(os.tmpdir(), 'git-analysis');
    }

    async analyzeRepository(repoUrl) {
        try {
            // Create temporary directory for cloning
            const repoDir = path.join(this.tempDir, Date.now().toString());
            await fs.mkdir(repoDir, { recursive: true });

            // Clone repository
            const git = simpleGit();
            await git.clone(repoUrl, repoDir);
            const localGit = simpleGit(repoDir);

            // Gather all metrics
            const [
                commitMetrics,
                envLeaks,
                licenseInfo,
                codeChurn
            ] = await Promise.all([
                this.getCommitMetrics(localGit),
                this.checkEnvLeaks(repoDir),
                this.checkLicense(repoDir),
                this.analyzeCodeChurn(localGit)
            ]);

            // Store results in Supabase
            const { data: repo, error } = await this.supabase
                .from('repositories')
                .insert({
                    url: repoUrl,
                    name: path.basename(repoUrl, '.git'),
                    last_analyzed_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;

            // Store commit metrics
            await this.supabase
                .from('commit_metrics')
                .insert(commitMetrics.map(metric => ({
                    repository_id: repo.id,
                    ...metric
                })));

            // Cleanup
            await fs.rm(repoDir, { recursive: true, force: true });

            return {
                commitFrequency: commitMetrics,
                codeChurn,
                envLeaks,
                licenseInfo
            };

        } catch (error) {
            console.error('Repository analysis failed:', error);
            throw error;
        }
    }

    async getCommitMetrics(git) {
        const log = await git.log();
        const commitsByDate = {};

        log.all.forEach(commit => {
            const date = commit.date.split(' ')[0];
            commitsByDate[date] = (commitsByDate[date] || 0) + 1;
        });

        return Object.entries(commitsByDate).map(([date, count]) => ({
            date,
            commit_count: count
        }));
    }

    async checkEnvLeaks(repoDir) {
        const envPatterns = [
            /([A-Za-z_][A-Za-z0-9_]*=[\s]*[^\s]+)/g,
            /(api[_-]?key|api[_-]?secret|password|secret|token)[=:]\s*['"]?[A-Za-z0-9_-]+['"]?/gi
        ];

        const results = [];
        const files = await fs.readdir(repoDir, { recursive: true });

        for (const file of files) {
            if (file.includes('node_modules')) continue;

            try {
                const content = await fs.readFile(path.join(repoDir, file), 'utf8');
                for (const pattern of envPatterns) {
                    const matches = content.match(pattern);
                    if (matches) {
                        results.push({
                            file,
                            matches: matches.length
                        });
                    }
                }
            } catch (error) {
                continue; // Skip files that can't be read
            }
        }

        return results;
    }

    async checkLicense(repoDir) {
        const licenseFiles = ['LICENSE', 'LICENSE.md', 'LICENSE.txt'];
        let licenseContent = null;

        for (const file of licenseFiles) {
            try {
                licenseContent = await fs.readFile(path.join(repoDir, file), 'utf8');
                break;
            } catch (error) {
                continue;
            }
        }

        return {
            exists: !!licenseContent,
            type: this.detectLicenseType(licenseContent)
        };
    }

    async analyzeCodeChurn(git) {
        const stats = await git.log(['--stat']);
        return stats.all.map(commit => ({
            date: commit.date,
            insertions: commit.diff?.insertions || 0,
            deletions: commit.diff?.deletions || 0,
            files_changed: commit.diff?.changed || 0
        }));
    }

    detectLicenseType(content) {
        if (!content) return 'Unknown';
        
        const licenses = {
            'MIT': /MIT License/i,
            'Apache': /Apache License/i,
            'GPL': /GNU General Public License/i,
            'BSD': /BSD License/i
        };

        for (const [type, pattern] of Object.entries(licenses)) {
            if (pattern.test(content)) return type;
        }

        return 'Other';
    }
}

module.exports = new GitAnalytics();
